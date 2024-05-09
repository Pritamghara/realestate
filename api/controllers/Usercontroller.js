import express from 'express';
import { errorhandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import User from '../models/Usermodel.js';
import Listing from '../models/Listingmodel.js';

const router = express.Router();

export const test = (req, res) => {
    const token = req.cookies['access_token'];

    if (token) {
        // Access token is available
        console.log("Access token:", token);
        res.send("Access token available: " + token);
    } else {
        // Access token is not available
        console.log("Access token not available");
        res.status(401).send("Access token not available");
    }
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorhandler(401, "You can only update your own account!"));
    }
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10); 
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username, 
                email: req.body.email, 
                password: req.body.password, 
                avatar: req.body.avatar 
            }
        }, { new: true });
        const { password, ...rest } = updatedUser._doc; 
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}


export const deleteUser = async (req, res, next) => {
    try {
        const token = req.cookies['access_token'];
        if (!token) {
            return next(errorhandler(401, "UNAUTHORIZED"));
        }

        if (req.user.id !== req.params.id) {
            return next(errorhandler(401, "You can only delete your own account"));
        }

        await User.findByIdAndDelete(req.params.id);

        res.clearCookie('access_token');

        return res.status(200).json('User has been deleted');
    } catch (error) {
        return next(error); // Pass the error to the error-handling middleware
    }
};


export const getUserListing=async (req,res,next)=>{
    if(req.user.id===req.params.id){

        try {

            const listing=await Listing.find({userRef:req.params.id})
            res.status(200).json(listing)
            
        } catch (error) {
            next(error)
            
        }

    }
    else{
        return next(errorhandler(401,"you can only watch your own Listings"))

    }
}

export const  searchuser=async(req,res,next)=>{

    try {
        
        const user=await User.findById(req.params.id)
        if(!user)return (errorhandler(404,'user not found'))
    
        const {password:pass,...rest}=user._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
        
    }

}
