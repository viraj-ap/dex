import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
});

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));

// routes declaration


app.listen(process.env.PORT || 5000, () => {
    console.log(`⚙️ Server is running at port : ${process.env.PORT || 5000}`);
});
