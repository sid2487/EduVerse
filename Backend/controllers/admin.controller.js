import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { z } from "zod";
import { Admin } from "../models/admin.model.js";
import config from "../config.js";


export const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    // console.log(firstName, lastName, email, password)
    if(!firstName || !lastName || !email || !password){
        return res.status(400).json({ errors: "All fields are required" });
    }

    const adminSchema = z.object({
        firstName: z.string().min(3, { message: "firstName must be atleast 3 char long "}),
        lastName: z.string().min(3, { message: "lastName must be atleast 3 char long" }),
        email: z.string().email(),
        password: z.string().min(6, {message: "password must be min 6 char" }),
    });

    const validateData = adminSchema.safeParse(req.body);
    if(!validateData){
        return res.status(400).json({ errors: validateData.error.issues.map((err) => err.message )});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingAdmin = await Admin.findOne({ email: email });
        if(existingAdmin){
            return res.status(400).json({ errors: "User already exist, please login" })
        }
        
        const newAdmin = new Admin({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        })

        await newAdmin.save();
        res.status(201).json({ message: "Admin signup Successfully", newAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: "Error in signup" });   
    }
    
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({ errors: "All fields are required" });
    }

    try {
        const admin = await Admin.findOne({ email: email });
        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if (!admin || !isPasswordCorrect) {
            return res.status(400).json({ errors: "Invalid Credentials" })
        }

        // jwt token
        const token = jwt.sign({ id: admin._id }, config.JWT_ADMIN_PASSWORD, {
            expiresIn: "1d"
        })

        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            samsSite: "Strict",
        };

        res.cookie("jwt", token, cookieOptions);
        res.status(200).json({ message: "Admin logged in Successfully", admin, token });
    } catch (error) {
        console.error(error);
        res.status(400).json({ errors: "Error in Admin login, try again" });
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logged out Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: "Error in logout" });
    }
}