const {body, validationResult, check} = require('express-validator')
const handle_data = require('../controllers/handle_data')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


function get_register_form(req, res, next) {
    res.render('register_form', {title: 'Register'})
}

const post_register_form = [

    body('firstName', 'First Name is required').trim().isLength({min: 1}).escape(),
    body('lastName', 'Last Name is required').trim().isLength({min: 1}).escape(),
    body('dateOfBirth', 'Date of Birth is required').trim().isLength({min: 1}).bail().custom(date=>handle_data.validDate(date, 'Date in invalid')),
    body('contact').trim().isLength({min: 1}).withMessage('Contact is required').bail().isNumeric().withMessage('Contact is numeric only')
    .bail().isLength({max:10}).withMessage('Invalid contact number'),
    body('email').trim().isLength({min: 1}).withMessage('Email is required').bail().isEmail().withMessage('Invalid Email').toLowerCase(),
    body('email').custom((email, {req}) => {
        return User.findOne({email: email}).then(res => {
            if(res) throw new Error('Email already in use')
        })
    }),
    body('password').trim().isLength({min: 1}).withMessage('Password is required').bail()
    .isLength({min: 8})
    .withMessage('Password must be: 8 characters long')
    .isStrongPassword({minUppercase: 1})
    .withMessage('Password must contain: 1 upper case letter')
    .isStrongPassword({minNumbers: 1})
    .withMessage('Password must contain: 1 digit')
    .isStrongPassword({minSymbols: 1})
    .withMessage('Password must contain: 1 symbol')
    .escape(),
    body('confirm_password').trim().isLength({min:1}).withMessage('Confirm password is required')
    .bail().custom((cpass, {req}) => {
        if(cpass !== req.body.password) throw new Error('Password does not match')
        return true
    }),

    async (req, res, next) => {
        const {firstName, lastName, dateOfBirth, contact, email, password} = req.body
        const errors = validationResult(req)
        // try{
        //     let res = await User.findOne({email: email}).exec()
        //     if(res) {
        //         errors.errors.push({
        //             value: email,
        //             param: 'email',
        //             msg: 'Email already in use',
        //             location: 'body'
        //         })
        //     }
        // }    
        // catch(err) {return next(err)}
        console.log({...req.body})
        if(!errors.isEmpty()) {
            res.render('register_form', {title: 'Register', errors: errors.array(), input: {...req.body}})
        }
        else {
            try {
                const hashed_password = await bcrypt.hash(password, 10)
                const user = new User({
                    firstName,
                    lastName,
                    dateOfBirth,
                    contact,
                    email,
                    password: hashed_password,
                    createdOn: Date().toString()
                })
                const result = await user.save()
            }
            catch(err) {
                return next(err)
            }
            res.json('user created')
        }
    }
]

function get_login_form(req, res, next) {
    console.log(req.user)
    res.send('get login form')
}

const post_login_form = [ 
    body('username').trim().isLength({min:1}).withMessage('Username is required')
    .bail().isEmail().withMessage('Invalid username').toLowerCase().escape(),
    body('password').trim().isLength({min:1}).withMessage('Password is required').escape(),
    
    async (req, res, next) => {
        const {username, password} = req.body
        const errors = validationResult(req)
        try {
            const result = await User.findOne({email: username}).exec()
            if(!result) { 
                errors.errors.push({
                    value: username,
                    msg: 'Username does not exist',
                    param: 'username',
                    location: 'body',
                })
            }
            else {
                let match = await bcrypt.compare(password, result.password)
                if (!match) {
                    errors.errors.push({
                        value: password,
                        msg: 'Incorrect Password',
                        param: 'password',
                        location: 'body',
                    }) 
                }
            }
        }
        catch(err) {
            next(err)
        }
        if(!errors.isEmpty()){
            return res.json(errors.array())
        }
        try {
            const user = await User.findOne({email: username}).exec()
            if (user.role == 'admin' || user.role == 'staff') {
                const token = jwt.sign({
                    user: user.email,
                    role: user.role,
                }, process.env.ACCESS_TOKEN_SECRET)
                return res.set({
                    'authorization': token
                }).redirect('/')
                
            }
            return res.json('hello visiter')
        }
        catch(err){
            return next(err)
        }
    }
]

module.exports = {
    get_register_form,
    post_register_form,
    get_login_form,
    post_login_form,
}