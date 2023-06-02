import express from "express";
import connectDB from "./config/db.js";
import api from "./routes/api.js";

const app = express();

connectDB();

app.use(express.json());

app.use("/api", api);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
