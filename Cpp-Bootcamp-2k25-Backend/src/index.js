import dotenv from "dotenv";
import connectDB from "./database/connectDatabase.js";
import app from "./app.js";

dotenv.config();

connectDB();
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
