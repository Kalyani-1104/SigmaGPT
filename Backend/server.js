import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chats.js"

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("*", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  connect();
});

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected Successfully!");
  } catch (err) {
    console.log("Failed to Connect!");
  }
}
