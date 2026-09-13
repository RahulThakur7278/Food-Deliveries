import "dotenv/config";
import app from "./app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 3000;

// middlewares


app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
