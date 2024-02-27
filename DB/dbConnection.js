import chalk from "chalk";
import mongoose from "mongoose";

export const dbConnection = async () => {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log(chalk.blueBright(`DB connected on ${process.env.DB_URL}`));
    })
    .catch((err) => {
      console.log(chalk.red("failed to connect to dataBase"), err);
    });
};
  