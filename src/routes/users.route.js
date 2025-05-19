import express from "express"
import { createDummyUser, displayHomeMessage, getAllUsers, getSingleUser, getUserByJobDescription, login, signUp } from "../controllers/users.controllers.js";
import { signUpValidation } from "../../validators/signup.validation.js";
import { validate } from "../../validators/validate.js";

const router = express.Router();

router.get('/home',displayHomeMessage);
router.get('/get-user-data', createDummyUser);
router.post('/signup',signUpValidation, validate ,signUp);
router.post('/login', login)
router.get('/get-all-users', getAllUsers)
router.get('/single-user/:id', getSingleUser)
router.get('/user-jd', getUserByJobDescription)



export default router;