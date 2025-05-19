import config from "../config.js";
import jwt from "jsonwebtoken"

const adminMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({ errors: "No token provide" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, config.JWT_ADMIN_PASSWORD);
        req.adminId = decoded.id;

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: "Invalid token or expired" });
    }
}

export default adminMiddleware;