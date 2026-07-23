const dotenv = require("dotenv");
dotenv.config(); //first
const connectDB = require("./config/db");
const app = require("./app");
// const chatRoutes = require("./routes/chatRoutes");

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});