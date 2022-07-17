const HttpError = require("../models/HttpEror");
const User = require("../models/User");

const { validationResult } = require('express-validator')

const getUsers = async (req, res, next) => {

    let users;
    try {
        users = await User.find({}, '-password')
    }catch (e) {
        return  next(new HttpError("Something go wrong", 500))
    }

    res.json({users: users.map(u => u.toObject({getters: true}))});
}

const login = async (req, res, next) => {
    const { password, email } = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email: email})
    }catch (e) {
        return  next(new HttpError("Something go wrong", 500))
    }

    if (!existingUser || existingUser.password !== password) {
        return next(new HttpError("Dont find a user, credentials seem to be wrong", 401))
    }

    res.json({message: "Logged in!", user: existingUser.toObject({getters: true})})
}

const signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError("Provide normal data", 422));
    }

    const {name, password, email} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email: email})
    }catch (e) {
        return  next(new HttpError("Something go wrong", 500))
    }

    if (existingUser) {
        return next(new HttpError("Could not create user, email exists", 422))
    }

    const createdUser = new User({
        name,
        password,
        email,
        codes: [],
    })
    try {
        await createdUser.save();
    }catch (e) {
        return  next(new HttpError("Something go wrong", 500))
    }

    res.status(201).json({user: createdUser.toObject({getters: true})})
}

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
