import mongoose from "mongoose";
import User from "../../models/users.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


export const signUp = async( req, res) => {
    const {firstName, lastName, email, password, jobDescription} = req.body;
    
    try {
        
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(401).json({
                success: false, 
                message: 'User already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            jobDescription

        })
        await newUser.save();

        const newUserWithoutPassword = {...newUser.toObject(), password: undefined};

        return res.status(201).json({
            success: true,
            message: 'User has been created successfully',
            data: newUserWithoutPassword
        });
       
        
    } catch (error) {
        console.log('Error caused by: ', error,);
        return res.status(500).json({success: false, message: 'Internal server error occurred while signing up'});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const existingUser = await User.findOne({email});

        if(!existingUser){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if(!isMatch){
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect'
            })
        }

        const token = jwt.sign({id: existingUser._id}, process.env.SECRET_KEY, {expiresIn: '1d'});

        res.cookie('jwtToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict'
        })


        const{password: _, ...userData} = existingUser._doc;

        res.status(200).json({
            success: true,
            data: userData
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while logging in'
        })
    }
}

export const getAllUsers = async(req, res) => {
    try {
        const allUsers = await User.find().select('-password');

        if(!allUsers || allUsers.length === 0 ){
            return res.status(400).json({
                success: false, 
                message: 'No users found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Users data retrieved successfully',
            data: allUsers
        })

    } catch (error) {
        console.log('Error caused by: ', error,);
        return res.status(500).json({success: false, message: 'Internal server error occurred while getting all users'});
    }
}

//req object we have three: body, params, query
export const getSingleUser = async(req, res) => {
    try {
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: 'Invalid id specified'
            });
        }

        const user = await User.findById(id);

        //if user is not in our database
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        //when user is present
        return res.status(200).json({
            success: true,
            message: 'User data retrieved',
            data: user
        })
        
    } catch (error) {
        console.log("Error caused by: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while displaying user data"
        })
    }

}


//req.query
export const getUserByJobDescription = async (req, res) => {
    try {
        const {jobDescription} = req.query;

        if(!jobDescription){
            return res.status(400).json({
                success: false,
                message: "Job description has not been specified"
            })
        }

        //retrieve users by their job description
        const user = await User.find({jobDescription});

        if(!user || user.length === 0){
            return res.status(404).json({
                success: false,
                message: 'No users found',
                
            })
        }

        //if such users exist
        return res.status(200).json({
            success: true,
            message: 'Users retrieved',
            data: user
        })

    } catch (error) {
        console.log("Error caused by: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while getting user with job description"
        })
    }
}


export const displayHomeMessage = async (req, res) => {
    try {
        return res.status(200).json({
            success: true, 
            message: 'Welcome to masterclass backend'
        })
    } catch (error) {
       console.error(error);
       return res.status(500).json({success: false, message: 'Internal server error occurred while displaying home message'}) 
    }
};

export const createDummyUser = async(req, res) => {
    try {
        const user = {
            firstName: 'Marvin',
            lastName: "Annorbah",
            email: "marv@gmail.com"
        }

        return res.status(200).json({
            success: true,
            message: 'User data displayed successfully',
            data: user
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: 'Internal server error while displaying user data'})
    }
}


