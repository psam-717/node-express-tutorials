import mongoose from "mongoose";
import User from "../../models/users.models.js";
import bcrypt from "bcrypt";


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

        //getting user
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


