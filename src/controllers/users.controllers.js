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

export const deleteUserById = async(req, res) => {
    const {id} = req.params;
    try {
        if(!id){
            return res.status(404).json({
                message: 'Id not specified'
            })
        }

        const userToDelete = await User.findByIdAndDelete(id);

        if(!userToDelete){
            return res.status(404).json({
                message: 'User not available'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        })

    } catch (error) {
       console.log('Error caused by ', error); 
    }
}


export const deleteUserByEmail = async(req, res) => {
    const {email} = req.body;
    try {
        // can be handled using the express validator
        if (!email){
            return res.status(404).json({
                message: 'Email not available'
            })
        }

        const deletedUser = await User.findOneAndDelete({email});

        if(!deletedUser){
            return res.status(404).json({
                message: 'User cannot be found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        })

    } catch (error) {
        console.log("Error caused by ", error);
    }
}

export const updateUserData = async (req, res) => {
   const {updateData} = req.body;
   const {id} = req.params;
   try {
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: 'Invalid id specified'
            })
        }

        const existingUser = await User.findById(id)
        if(!existingUser){
            return res.status(404).json({
                message: 'User does not exist'
            })
        }

        if(!updateData || typeof updateData !== 'object' || Object.keys(updateData).length === 0){
            return res.status(400).json({
                message: 'the data to be updated should be a non empty object'
            })
        }
    
        // user should be able to update firstName, lastName, jobDescription
        const allowedFields = ['firstName', 'lastName', 'jobDescription'];
        const providedFields = Object.keys(updateData);
        const disallowedFields = providedFields.filter(field => !allowedFields.includes(field));

        if(disallowedFields.length > 0){
            return res.status(400).json({
                message: 'Fields that can be updated are firstName, lastName and jobDescription'
            })
        }

        if (updateData.jobDescription && !['frontend', 'backend', 'none'].includes(updateData.jobDescription)){
            return res.status(400).json({
                message: 'Job description can only take the strings, frontend, backend or none'
            })
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {$set: updateData},
            {new: true, runValidators: true, select: 'firstName, lastName, jobDescription'}
        );

        if(!updatedUser){
            return res.status(403).json({
                message: 'User could not be updated'
            })
        }

        return res.status(200).json({
            message: 'User data updated successfully',
            data : {
                firstName: updateData.firstName,
                lastName: updateData.lastName,
                jobDescription: updateData.jobDescription
            }
        })

   } catch (error) {
        console.log('Error caused by ', error);
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


