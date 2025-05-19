import { v2 as cloudinary } from "cloudinary";
import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";


export const createCourse = async (req, res) => {
    const adminId = req.adminId;
    const { title, description, price } = req.body;

    try {
        if(!title || !description || !price){
            return res.json(400).json({ errors: "All fields are required" });
        }

        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(400).json({ errors: "No file upload" });
        }
        
        const { image } = req.files;
        // console.log("req.files:", req.files);

        const allowedFormat = ["image/png", "image/jpeg", "image/avif"];
        if(!allowedFormat.includes(image.mimetype)){
            return res.status(400).json({ errors: "Invalid file format. Only PNG & JPEG are allowed" });
        }

        // console.log("Cloudinary Config:", cloudinary.config());
        // console.log("Temp file path:", image.tempFilePath);

        // cloudinary code 

        // const cloud_response = await cloudinary.uploader.upload(image.tempFilePath, {
        //     resource_type: "auto"
        // });

        // ✅ Convert buffer to base64
        const base64Image = `data:${image.mimetype};base64,${image.data.toString("base64")}`;

        // ✅ Upload directly using base64 (no temp file needed)
        const cloud_response = await cloudinary.uploader.upload(base64Image, {
            resource_type: "image"
        });

        if(!cloud_response || cloud_response.error){
            return res.status(400).json({ errors: "Error uploading files to cloudinary" });
        }

        // console.log("Temp file path:", image.tempFilePath);

        const courseData = {
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                url: cloud_response.url,
            },
            creatorId: adminId,
        }

        const course = await Course.create(courseData);
        res.status(201).json({ message: "Course created Successfully", course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating Course" });
    }
}


export const updateCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;

    try {
        console.log("Update request received:", {
            adminId,
            courseId,
            body: req.body,
            files: req.files ? Object.keys(req.files) : "No files"
        });

        const courseSearch = await Course.findById(courseId);
        if (!courseSearch) {
            return res.status(400).json({ errors: "Course not found" });
        }

        // Extract fields from body
        const { title, description, price } = req.body;

        if (!title || !description || !price) {
            return res.status(400).json({ errors: "Title, description and price are required" });
        }

        // Prepare course update data
        const updateData = {
            title,
            description,
            price,
        };

        // Check if there's a new image to upload
        if (req.files && req.files.image) {
            console.log("New image found, processing upload");
            const { image } = req.files;

            const allowedFormat = ["image/png", "image/jpeg", "image/avif"];
            if (!allowedFormat.includes(image.mimetype)) {
                return res.status(400).json({ errors: "Invalid file format. Only PNG & JPEG are allowed" });
            }

            try {
                // Convert buffer to base64
                const base64Image = `data:${image.mimetype};base64,${image.data.toString("base64")}`;

                // Upload to cloudinary
                const cloud_response = await cloudinary.uploader.upload(base64Image, {
                    resource_type: "image"
                });

                if (!cloud_response || cloud_response.error) {
                    console.error("Cloudinary upload error:", cloud_response?.error || "Unknown error");
                    return res.status(400).json({ errors: "Error uploading files to cloudinary" });
                }

                console.log("Cloudinary upload successful:", cloud_response.public_id);

                // Add image data to update object
                updateData.image = {
                    public_id: cloud_response.public_id,
                    url: cloud_response.url,
                };
            } catch (uploadError) {
                console.error("Image upload error:", uploadError);
                return res.status(500).json({ errors: "Error processing image upload" });
            }
        } else {
            console.log("No new image, keeping existing image");
        }

        console.log("Updating course with data:", updateData);

        const course = await Course.findOneAndUpdate(
            { _id: courseId, creatorId: adminId },
            updateData,
            { new: true }
        );

        if (!course) {
            return res.status(400).json({ errors: "Can't update, created by other admin" });
        }

        res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
        console.error("Error in updating the course:", error);
        res.status(500).json({ errors: "Error in updating the course: " + error.message });
    }
}

export const deleteCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;
    
    try {
        const course = await Course.findOneAndDelete({
            _id: courseId,
            creatorId: adminId,
        });

        if(!course){
            return res.status(400).json({ errors: "can't delete course, created by other admin" });
        }

        res.status(201).json({ message: "Course deleted Successfully" });
    } catch (error) {
        console.error("Error in course deleting");
        res.status(500).json({ errors: "Error in course deleting" });
    }
}

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        if(!courses){
            return res.status(400).json({ errors: "No course found" });
        }

        res.status(201).json({ courses });
    } catch (error) {
        console.error("Failed to fetch courses");
        res.status(500).json({ errors: "Failed to fetch the courses" });
    }
};

export const courseDetails = async (req, res) => {
    const { courseId }= req.params;

    try {
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(400).json({ errors: "Course not Found" });
        }
        res.status(201).json({ course })
    } catch (error) {
        console.error("Failed to fetch the course details" );
        res.status(500).json({ errors: "Failed to fetch the course details "});
    }
};

import Stripe from "stripe"
import config from "../config.js";

const stripe = new Stripe(config.stripSecretKey);
console.log(config.stripSecretKey)

export const buyCourse = async(req, res) => {
    const { userId } = req;
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(400).json({ errors: "Course not Found" });
        }

        const existingPurchase = await Purchase.findOne({ userId, courseId });
        if(existingPurchase){
            return res.status(400).json({ errors: " User has already purchased this course" });
        }

        // stripe code
        const amount = course.price;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            payment_method_types: ["card"],
        });
        
        res.status(201).json({ message: "Course purchased Successfully", course, clientSecret: paymentIntent.client_secret, });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: "Error in purchasing the Course" });
    }
}