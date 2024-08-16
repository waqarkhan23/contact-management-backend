import app from "./src/app.js";
import connectDB from "./src/db/index.js";
import dotenv from "dotenv";

dotenv.config();
connectDB();
const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
