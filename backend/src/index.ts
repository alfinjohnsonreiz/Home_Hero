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
import http from "http"; 
import { Server } from "socket.io";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];
//! Socket io set up
const server = http.createServer(app);
//! Socket.IO setup
const io = new Server(server, {
  cors: {
    origin:(origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser requests like Postman
      if (allowedOrigins.includes(origin)) {
        callback(null, true); // allow this origin
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  },
});


app.use(express.json());
app.use(
  cors({
    origin:(origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser requests like Postman
      if (allowedOrigins.includes(origin)) {
        callback(null, true); // allow this origin
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }, // your frontend URL
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

//! Socket.IO logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_job",({jobId}:{jobId:any})=>{
    const roomName=`job_${jobId}`
    socket.join(roomName)
    console.log(`User ${socket.id} joined room ${roomName}`)
  })

  socket.on('send_message',(data:{jobId:string;message:string;from:string,time:string})=>{
    const roomName=`job_${data.jobId}`;
    console.log(`Message in room ${roomName}`,data.message)
    io.to(roomName).emit("receive_message",data)
  })


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
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

    // app.listen(port, () => {
    //   console.log(`Server is running on ${port}`);
    // });
    server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

  } catch (error) {
    console.log("Error starting server:", error);
  }
};

startserver();
