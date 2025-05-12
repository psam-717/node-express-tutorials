import {body} from "express-validator";

export const signUpValidation = [
    body('firstName')
    .isString().withMessage('First name field should be a non numeric value (a string)')
    .notEmpty().withMessage('First name field should not be empty'),

    body('lastName')
    .isString().withMessage('last field should be a non numeric value (a string)')
    .notEmpty().withMessage('last name field should not be empty'),

    body('email')
    .isString().withMessage('Email field should be a non numeric value (a string)')
    .notEmpty().withMessage('Email field should not be empty')
    .isEmail().withMessage('Please provide a valid email'),

    body('password')
    .isString().withMessage('Password field should a string')
    .notEmpty().withMessage('Password field should not be empty'),

    body('jobDescription')
    .isString().withMessage('Job description field should be a non numeric value (a string)')
    .notEmpty().withMessage('Job description field should not be empty')
    .isIn(['frontend', 'backend', 'none']).withMessage('Job description field can only take frontend, backend or none')

]






