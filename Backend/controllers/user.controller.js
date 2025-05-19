import { z } from "zod";
import bcrypt from "bcryptjs"
import { User } from "../models/user.model.js";
import config from "../config.js";
import jwt from "jsonwebtoken"
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";

export const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if(!firstName || !lastName || !email || !password){
        return res.status(400).json({ errors: "All fields are required" });
    }

    const userSchema = z.object({
        firstName: z.string().min(3, { message: "firstName must be atleast 3 char long"}),
        lastName: z.string().min(3, { message: "lastName must be atleast 3 char long" }),
        email: z.string().email(),
        password: z.string().min(6, { message: "password must be atleast 6 char long" }),
    });

    const validateData = userSchema.safeParse(req.body);
    if(!validateData.success){
        return res.status(400).json({ errors: validateData.error.issues.map((err) => err.message )})
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await User.findOne({ email: email });
        if(existingUser){
            return res.status(400).json({ errors: "User already exist" });
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        return res.status(201).json({ message: "User signup successfully", newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errors: "Error in signup "});
    }
    
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({ errors: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email: email }).select("+password");
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!user || !isPasswordCorrect){
            return res.status(400).json({ errors: "Invalid Credentials" });
        }

        // jwt code 

        const token = jwt.sign({ id: user._id}, config.JWT_USER_PASSWORD , {
            expiresIn: "1d"
        } );

        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        }

        res.cookie("jwt", token, cookieOptions);
        res.status(201).json({ message: "User registered Successfully", user, token })
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: "Error in login" });
    }
};

export const logout =  (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(201).json({ message: "Logged out Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errros: "Error in logout" });
    }
};

export const purchases = async (req, res) => {
    const userId = req.userId;

    try {
        const purchased = await Purchase.find({ userId });

        if(!purchased) {
            return res.status(400).json({ errors: "No Purchase course found" });
        }

        let purchasedCourseId = [];
        for(let i=0; i<purchased.length; i++){
            purchasedCourseId.push(purchased[i].courseId);
        }
        const courseData = await Course.find({
            _id: { $in: purchasedCourseId },
        });

        res.status(200).json({ purchased, courseData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: "Error in Purchase" });
    }
}