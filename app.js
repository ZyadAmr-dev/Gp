import { configDotenv } from "dotenv";
import express from "express";
import { connectDB } from "./db.js";
import searchRouter from "./routes/searchRoutes.js"

configDotenv();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(searchRouter)

const startServer = async () => {
  try {
    await connectDB(); 
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
