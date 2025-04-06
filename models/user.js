import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = mongoose.Schema({
    fullName : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        validate : {
            validator : (value) => {
                const result = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return result.test(value)
            },
            message : 'Please enter a valid email address'
        }
    },
    state : {
        type : String,
        default : ""
    },
    locality : {
        type : String ,
        default : ""
    },
    city: {
        type : String,
        default : ""
    },
    password : {
        type : String ,
        required : true,
        validate : {
            validator : (value) => {
               return value.length >=8
            },
            message : 'Password must be at least 8 characters long'
        }
    },

}) 


userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});


const User = mongoose.model("User" , userSchema)
export default User