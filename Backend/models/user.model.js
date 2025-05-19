import monogoose from "mongoose"

const userSchema = new monogoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    password: {
        type: String,
        required: true,
    },
});

export const User = monogoose.model("User", userSchema);