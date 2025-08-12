import "reflect-metadata";
import express from "express";
import cors from "cors";
import { connectDB } from "./db/connectDB";
import userRouter from "./routes/userRoutes";
import cookieParser from "cookie-parser";
import tokenRouter from "./routes/refreshToken";
import { serviceRouter } from "./routes/serviceRouter";
import { quoteRouter } from "./routes/quoteRouter";
import { jobRouter } from "./routes/jobRouter";
import { revieRouter } from "./routes/reviewRouter";
import path from "path";
import Razorpay from "razorpay";
import bodyParser from "body-parser";
import { payRouter } from "./routes/payRouter";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // allow cookies/credentials
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const port = 4040;
export const razorpay = new Razorpay({
  key_id: "rzp_test_gOuZoQ2fE5znQd",
  key_secret: "URpNX80MPbUte6GqnTP1Ye1U",
});

const startserver = async () => {
  try {
    await connectDB();

    //! register and login
    app.use("/auth", userRouter);

    //! refeshtoken and accesToken
    app.use("/refreshToken", tokenRouter);

    //! service requests
    app.use("/serviceReq", serviceRouter);

    //! Quote
    app.use("/quote", quoteRouter);

    //! Job
    app.use("/job", jobRouter);

    // !Review
    app.use("/review", revieRouter);

    // !Payment
    app.use("/pay", payRouter);

    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  } catch (error) {
    console.log("Error starting server:", error);
  }
};

startserver();
