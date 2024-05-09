import User from "../models/Usermodel.js";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken"; 
import { errorhandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedpass = bcryptjs.hashSync(password, 10);
    const newuser = new User({ username, email, password: hashedpass });
    try {
        await newuser.save();
        res.status(200).json("User created successfully"); 
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validuser = await User.findOne({ email });
        if (!validuser) {
            return next(errorhandler(404, "User Not found"));
        }
        const validpass = bcryptjs.compareSync(password, validuser.password);
        if (!validpass) {
            return next(errorhandler(401, 'Wrong credentials'));
        }
        const token = jwt.sign({ id: validuser._id }, process.env.JWT_SECRET);
        const tokenExpiration = 3600000;
        const {password:pass,...rest}=validuser._doc
        res.cookie('access_token', token,{maxAge: tokenExpiration,  httpOnly: true }).status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    try {
        const { email, name, photo } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ email });

        if (user) {
            // If user exists, generate JWT token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

            // Omit the password from the user object
            const { password, ...rest } = user._doc;

            // Set JWT token as cookie and send user data in response
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
        } else {
            // If user doesn't exist, generate a random password
            const generatedPass = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPass = bcryptjs.hashSync(generatedPass, 10);

            // Create a new user with generated password
            const newUser = new User({
                username: name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email,
                password: hashedPass,
                avatar: photo
            });

            // Save the new user to the database
            await newUser.save();

            // Generate JWT token for the new user
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

            // Omit the password from the user object
            const { password, ...rest } = newUser._doc;

            // Set JWT token as cookie and send user data in response
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
}

export const signOut=async(req,res,next)=>{

    const token=req.cookies['access_token']

    if(!token){
        res.redirect('/signin'); 
        
        
        
    }
    try {
        
        res.clearCookie('access_token')
        res.status(200).json("User has been logged out")
        
    } catch (error) {
        next(error)
        
    }
}
export const authtoken = async (req, res, next) => {
    // Retrieve the token from the request cookies
    const token = req.cookies['access_token'];

    // Check if the token exists
    if (!token) {
        // Handle the case where the token is not found
        return res.status(401).json({ message: "Token not found" });
    }

    // Send the token as a JSON response
    res.json({ token });
};

