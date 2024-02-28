import { dbConnection } from "./DB/dbConnection.js";
import * as RH from "./src/utils/HandlingError.js";
import path from "path";
import dotenv from "dotenv";
import authRoutes from "./src/modules/auth/auth.routes.js";
import userRoutes from "./src/modules/user/user.routes.js";
import categoryRoutes from "./src/modules/category/category.routes.js";
import subCategoryRoutes from "./src/modules/subCategory/subCategory.routes.js";
import brandRoutes from "./src/modules/brand/brand.routes.js";
import productRoutes from "./src/modules/product/product.routes.js";
import couponRoutes from "./src/modules/coupon/coupon.routes.js";
import cartRoutes from "./src/modules/cart/cart.routes.js";
import orderRoutes from "./src/modules/order/order.routes.js";
import reviewRoutes from "./src/modules/review/review.routes.js";
import { auth } from "./src/middleware/auth.js";
import { validRoles } from "./src/utils/validRoles.js";
import morgan from "morgan";
import chalk from "chalk";
import cors from "cors";
import { rollBackDeleteFormCloud } from "./src/utils/rollBackDeleteFormCloud.js";
import { rollBackDeleteFormDB } from "./src/utils/rollBackDeleteFormBD.js";
dotenv.config({ path: path.resolve("config/.env") });
export const initApp = (app, express) => {
  const port = process.env.port || 3001;
  if (process.env.mode == "dev") {
    app.use(morgan("dev"));
  }
  app.use(cors());
  app.get("/", (req, res, next) => {
    res.status(201).json({ msg: "welcome to ECommerce" });
  });
  app.use((req,res,next)=>{
    if (req.originalUrl == "/orders/webhook") {
      next()
    }else{
      express.json()(req,res,next)
    }
  });
  app.use("/auth", authRoutes);
  app.use("/users", userRoutes);
  app.use("/category", categoryRoutes);
  app.use("/subCategory", subCategoryRoutes);
  app.use("/brands", brandRoutes);
  app.use("/products", productRoutes);
  app.use("/coupons", couponRoutes);
  app.use("/carts", cartRoutes);
  app.use("/orders", orderRoutes);
  app.use("/reviews", reviewRoutes);
  app.use("/test", auth(validRoles.User), (req, res) => {
    res.json({ msg: "done" });
  });
  dbConnection();
  app.use("/*", RH.RoutingHandler);
  app.use(
    RH.globalErrorHandling,
    rollBackDeleteFormCloud,
    rollBackDeleteFormDB
  );
  app.listen(port, () =>
    console.log(chalk.bgBlue(`app listening on port ${port}!`))
  );
};
