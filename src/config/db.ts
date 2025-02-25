import mongoose from "mongoose";

export const connectDB = () =>
  mongoose
    .connect(process.env.DATABASE_URL!)
    .then(() => console.log(`DB is connected`))
    .catch((err) => {
      console.error("Connect DB Error: ", err);
      process.exit(1); // Crash server
    });

export default connectDB;
