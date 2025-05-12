//middlewares work with the "next" keyword

import { validationResult } from "express-validator"

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    };

    next(); // this specifies that the function 
}