import express from "express";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/route.js";

dotenv.config();

const app = express();
const PORT = 8080 || process.env.PORT;
const MONGO_URI = process.env.MONGODB_URL;

app.use(cors({
    origin: [
    "http://localhost:3000", 
    "https://blog-website-sooty.vercel.app"   
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
let gridfsBucket;

if(process.env.NODE_ENV === 'production') {
  app.use(express.static("client/build"));
}

mongoose.connect(MONGO_URI)
  .then(() => {
    gridfsBucket = new GridFSBucket(mongoose.connection.db, { bucketName: "photos" });
    console.log("Database connected successfully");
    console.log("GridFSBucket initialized");

    app.use("/", router);

    app.get("/", (req, res) => {
      res.send("Server running with CORS enabled 🚀");
    });

    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });
