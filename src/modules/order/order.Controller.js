import productModel from "../../../DB/models/productCollection.js";
import cartModel from "../../../DB/models/cartCollection.js";
import couponModel from "../../../DB/models/couponCollection.js";
import orderModel from "../../../DB/models/orderCollection.js";
import { AppError, asyncHandler } from "../../utils/HandlingError.js";
import Stripe from "stripe";
import payment from "../../utils/payment.js";
import { createInvoice } from "../../utils/pdf.js";
//************************createOrder************************* */
export const createOrder = asyncHandler(async (req, res, next) => {
  const { address, phoneNumber, paymentMethod } = req.body;
  // check if user enter coupon

  if (req.body?.couponCode) {
    const coupon = await couponModel.findOne({
      couponCode: req.body.couponCode.toLowerCase(),
      usersUsedThisCoupon: { $nin: [req.user._id] },
    });
    if (!coupon || coupon.toDate < Date.now()) {
      return next(
        new AppError(
          "Invalid or Expired Coupon Code , or u r already used this code before",
          401
        )
      );
    }
    req.body.coupon = coupon;
  }
  let flag = false;
  let newProducts = [];
  // if user didn't enter productId
  if (!req.body.productId) {
    const checkCart = await cartModel.findOne({ userId: req.user._id }); //  check if he had product in his cart
    if (!checkCart || checkCart.products.length == 0) {
      // user doesn't has a cart
      return next(new AppError("please choose element to make order", 401));
    }
    flag = true;
    //if he found product in cart he will push it the general array
    newProducts = checkCart.products;
  } else {
    newProducts = [
      //if he enter product id and quantity */
      { productId: req.body?.productId, quantity: req.body?.quantity },
    ];
  }
  let finalProducts = [];
  let subTotal = 0;
  for (let product of newProducts) {
    const findProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
    });
    // console.log(findProduct, product.quantity, product.productId);
    if (!findProduct) {
      return next(
        new AppError("can't find this product or quantity is not enough", 401)
      );
    }

    if (flag) {
      product = product.toObject();
    }
    product.price = findProduct.priceAfterDiscount;
    product.title = findProduct.title;
    product.finalPrice = findProduct.priceAfterDiscount * product.quantity;
    finalProducts.push(product);
    subTotal += product.finalPrice;
  }
  const order = await orderModel.create({
    phoneNumber,
    address,
    paymentMethod,
    status: paymentMethod == "cash" ? "placed" : "waitPayment",
    subTotal,
    userId: req.user._id,
    couponId: req.body?.coupon?._id,
    products: finalProducts,
    totalPrice:
      subTotal - (subTotal * (req.body?.coupon?.couponAmount || 0)) / 100,
  });

  if (req.body?.couponCode) {
    await couponModel.findOneAndUpdate(
      { couponCode: req.body.couponCode },
      { $addToSet: { usersUsedThisCoupon: req.user._id } },
      { new: true }
    );
  }
  if (flag) {
    await cartModel.findOneAndUpdate(
      { userId: req.user._id },
      { products: [] },
      { new: true }
    );
  }
  for (const product of newProducts) {
    await productModel.findOneAndUpdate(
      { _id: product.productId },
      { $inc: { stock: -product.quantity } }
    );
  }

  const invoice = {
    shipping: {
      name: req.user.name,
      address: req.user.address,
      city: "cairo",
      state: "CAIRO",
      country: "EGYPT",
      postal_code: 94111,
    },
    items: order.products,
    subtotal: order.subTotal,
    paid: order.totalPrice,
    coupon: req?.body?.coupon?.couponAmount,
    invoice_nr: order._id,
    Date: order.createdAt,
  };

  await createInvoice(invoice, "invoice.pdf");
  if (paymentMethod == "card") {
    const stripe = new Stripe(process.env.stripe_key);
    if (req.body.coupon) {
      const coupon = await stripe.coupons.create({
        percent_off: req.body.coupon.couponAmount,
        duration: "once",
      });
      req.body.couponId = coupon.id;
      // console.log(coupon);
    }
    const session = await payment({
      stripe,
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      metadata: {
        order: order._id.toString(),
      },
      success_url: `${req.protocol}://${req.headers.host}/orders/success`,
      cancel_url: `${req.protocol}://${req.headers.host}/orders/cancel`,
      line_items: order.products.map((product) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
            },
            unit_amount: product.price * 100,
          },
          quantity: product.quantity,
        };
      }),
      discounts: req.body.couponId ? [{ coupon: req.body.couponId }] : [],
    });
    return res.json({ msg: "Done", order, url: session.url });
  }
  return res.json({ msg: "Done", order });
});
//************************************webhook************************************************** */
export const webhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  const stripe = new Stripe(process.env.stripe_key);

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  const { order } = event.data.object.metadata;
  // console.log(orderId);
  if (event.type != "checkout.session.completed") {
    await orderModel.findOneAndUpdate({ _id: order }, { status: "cancelled" });
    return res.status(400).json({ msg: "failed" });
  } else {
    await orderModel.findOneAndUpdate({ _id: order }, { status: "placed" });
    return res.status(202).json({ msg: "done" });
  }
});
//*****************************cancel order******************************************** */
export const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body;
  const order = await orderModel.findOne({ _id: orderId });
  if (!order) {
    return res.status(404).json({ msg: "invalid order id" });
  }
  if (order.status == "canceled") {
    return res.status(404).json({ msg: "order is just cncelled" });
  }

  if (
    (order.status == "placed" && order.paymentMethod == "cash") ||
    (order.status == "waitPayment" && order.paymentMethod == "card")
  ) {
    return res.status(400).json({ msg: "can't cancel this order" });
  }
  const cancelOrder = await orderModel.updateOne(
    { _id: order._id },
    { status: "canceled", cancelledBy: req.user_id ,reason }
  );
  if (!cancelOrder) {
    return res.status(404).json({ msg: "can't cancel this order" });
  }
  if (order.couponId) {
    await couponModel.updateOne(
      { _id: order.couponId },
      { $pull: { usersUsedThisCoupon: req.user._id } }
    );
  }
  for (const product of order.products) {
    await productModel.updateOne({_id:product.productId},{$inc:{stock:product.quantity}});
  }
   await orderModel.deleteOne({_id:order._id})
    return res.status(200).json({ msg: "done" });
  
});
