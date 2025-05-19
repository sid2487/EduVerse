import express, { json } from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import courseRoute from "./routes/course.routes.js";
import userRoute from "./routes/user.routes.js";
import adminRoute from "./routes/admin.routes.js"
import orderRoute from "./routes/order.routes.js"
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config();
connectDB();

const app = express();

// middlewares
app.use(express.json());
// app.use(fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
// }))

app.use(fileUpload());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))


// routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);

// Cloudinary configuration code
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});



const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    console.log("Server is running on ", PORT);
})
