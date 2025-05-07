import express from "express"
import { createDummyUser, displayHomeMessage } from "../controllers/users.controllers.js";

const router = express.Router();

router.get('/home', displayHomeMessage);
router.get('/get-user-data', createDummyUser);



export default router;