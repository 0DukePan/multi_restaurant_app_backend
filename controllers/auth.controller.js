import User from "../models/user.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const generateTokens = (userId) => {
	const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET);
	
	return { token };
};
export const signup =  async(req, res) => {
    const {fullName , email , password}  = req.body
    try {
        if (!email || !password || !fullName) {
			throw new Error("All fields are required");
		}

        const userAlreadyExists = await User.findOne({ email });

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}
       const user = new User({fullName , email , password})
       await user.save()
       res.status(201).json(user).select('-password');
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }else{
            const { token } = generateTokens(user._id);
            const { password, ...rest } = user._doc; 
    
            res.json({
                token,
                ...rest
            });

        }

    } catch (error) {
        console.log("Error in signin controller", error.message);
        res.status(500).json({ message: error.message });
    }
};