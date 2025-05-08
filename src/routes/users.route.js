import express from "express"
import { createDummyUser, displayHomeMessage, getAllUsers, signUp } from "../controllers/users.controllers.js";

const router = express.Router();

router.get('/home', displayHomeMessage);
router.get('/get-user-data', createDummyUser);
router.post('/signup', signUp);
router.get('/get-all-users', getAllUsers)



export default router;