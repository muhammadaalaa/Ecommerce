import categoryModel from "../../DB/models/categoryCollection.js";
import { asyncHandler } from "./HandlingError.js";
export const rollBackDeleteFormDB = asyncHandler(async (req, res, next) => {
  if (req.savedDocument) {
    console.log("in");
    const { model, id } = req.savedDocument;
    await model.findOneAndDelete({_id:id });
    console.log(req.savedDocument.id);
  }
});
