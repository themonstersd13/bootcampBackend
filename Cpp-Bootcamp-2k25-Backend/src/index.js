import dotenv from "dotenv";
import connectDB from "./database/connectDatabase.js";
import app from "./app.js";

dotenv.config();

connectDB();
const port = process.env.PORT || 8000;
app.get('/',(req,res)=>{
  res.send("connected");
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
