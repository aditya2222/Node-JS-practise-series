const express = require('express');
const {check, body} = require('express-validator/check');
const User = require('../models/user')

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
    body('email', 'Invalid Email').isEmail(),
    body('password', 'Invalid Password').isAlphanumeric().isLength({min: 5})
], authController.postLogin);

router.post('/signup',
    [check('email').isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, {req}) => {

            // if (value === 'test@test.com') {
            //
            //     throw new Error('This email address is forbidden')
            // }
            // return true

            return User.findOne({email: value})
                .then((user) => {
                    if (user) {
                        return Promise.reject('Email already exists')
                    }
                })
        }),
        body('password', 'Please enter a password with only numbers and text and with at least 5 characters')
            .isLength({min: 5})
            .isAlphanumeric(),
        body('confirmPassword').custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match')
            } else {
                return true
            }
        })
    ],

    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset)

router.get('/new-password/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router;
