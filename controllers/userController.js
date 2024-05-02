const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require('../config');
const ObjectId = require('mongodb').ObjectId;
const logger = require('../logger/logger');

const signup = async (req, res) => {
    const existingUser = await User.findOne({email: req.body.email});
    if(existingUser) {
        // logging
        logger.error(new Error('User already registered'))
        return res.status(200).json({
            message: "User Already Registered",
            success: "warning"
        })
    }
    const avt = req.body.displayName[0].toUpperCase()
    const hashedPassword = await bcrypt.hashSync(req.body.password, 8);
    const user = new User({
        displayName: req.body.displayName,
        password: hashedPassword,
        email: req.body.email,
        googleId: '',
        avatar: {
            data: avt,
            imgType: 'text'
        }
    });
    await user.save();
    // logging
    logger.info({meta: {information: "User registered successfully", username: req.body.displayName, email: req.body.email}})
    return res.status(200).json({
        message: "Registered Successfully",
        success: true
    })
}

const login = async(req, res) => {
    const existingUser = await User.findOne({email: req.body.email});
    if(existingUser) {
        const comparePassword = await bcrypt.compareSync(req.body.password, existingUser.password);
        if(comparePassword) {
            const user_token = jwt.sign({id: existingUser._id}, config.secrets.jwt_key, {expiresIn: 84600});
            logger.info({meta: {information: "User logged in successfully", email: req.body.email}})
            return res.status(200).json({
                message: "Logged in successfully",
                token: user_token,
                success: true
            })
        } else {
            logger.error(new Error("Incorrect password"))
            return res.status(403).json({
                message: "Password is incorrect. Try again",
                success: false
            })
        }
    } else {
        logger.error(new Error("User does not exists"))
        return res.status(403).json({
            message: "User does not exist. Create your account",
            success: false
        })
    }
}

const userInfo = async (req, res) => {
    const token = req.headers['x-access-token'];
    if(!token) {
        logger.warn('No token is generated')
        return res.status(403).json({
            message: "Invalid user credential",
            auth: false
        })
    }
    jwt.verify(token, config.secrets.jwt_key, (err, result) => {
        if(err) { 
            logger.error("Invalid user credentials")
            return res.status(403).json({
                message: "Invalid user credential",
                auth: false
            })
        }
        User.findOne({_id: new ObjectId(result.id)})
            .then(result => {
                logger.info({message: 'User details sent to client'})
                res.status(200).json({result})
            })  
    })
}

const updateUser = async (req, res) => {
    const reqEmail = req.query.email;
    const reqData = req.body;
    let hashPassword, update;
    if(reqData.password) {
        hashPassword = bcrypt.hashSync(reqData.password, 8)
        update = {
            displayName: reqData.displayName,
            password: hashPassword
        }
    } else {
        update = {
            displayName: reqData.displayName,
        }
    }

    const user = await User.findOneAndUpdate({email: reqEmail}, update, {new: true})
    // logger.info('Updated user information successfully')
    return res.status(200).json({message: "updated your profile", result: user})
}

module.exports = {
    signup: signup,
    login: login,
    userInfo: userInfo,
    updateUser: updateUser
}