const HttpError = require("../models/HttpEror");

const mongoose = require('mongoose');

const Code = require('../models/Code');
const User = require('../models/User');

const { validationResult } = require('express-validator');


const getCodeById = async (req, res, next) => {
    const codeId = req.params.cid;

    let code;
    try {
    code = await Code.findById(codeId);

    }catch (e) {
        return  next(new HttpError("Something go wrong...", 500));
    }

    if (!code) {
        return next(new HttpError("Could not find code for the provide id", 404));
    }

    res.json({code: code.toObject({getters: true})});
}

const getCodesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let code;

    try {
        code = await Code.find({creator: userId})
    }catch (e) {
        return next(new HttpError("Something go wrong, try again", 500))
    }


    if (code.length === 0) {
        return next(new HttpError("Could not find user codes for the provide id", 404));
    }

    res.json({codes: code.map(c => c.toObject({getters: true}))});
}

const createCode = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new HttpError("Provide normal data", 422)
    }

  const { title, code, creator } = req.body;

  const createdCode =  new Code({
      title,
      code,
      creator,
  });

  let user;

  try{
    user = await User.findById(creator);
  }catch (e) {
      const error = new HttpError('Creating code failed, please try again', 500);
      return next(error);
  }

  if (!user) {
      const error = new HttpError('Could not find by user id, please try again', 404);
      return next(error);
  }

  try {
      const session = await mongoose.startSession();
      session.startTransaction();
      await createdCode.save({session: session})
      user.codes.push(createdCode);
      await user.save({session: session});
      await session.commitTransaction();
  } catch (err) {
      const error = new HttpError('Creating code failed, please try again', 500);
      return next(error);
  }

  res.status(201).json(createdCode);
}

const updateCode = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError("Provide normal data", 422));
    }

    const { title, code } = req.body;
    const codeId = req.params.cid;

    let updatedCode;
    try{
        updatedCode = await Code.findById(codeId);
    }catch (err) {
        return next(new HttpError("Something go wrong", 500));
    }
    updatedCode.title = title;
    updatedCode.code = code;

    try {
        await updatedCode.save();
    }catch (err) {
        return next(new HttpError("Something go wrong", 500));
    }

    res.status(200).json({code: updatedCode.toObject({getters: true})});
}

const deleteCode = async (req, res, next) => {
    const codeId = req.params.cid;

    let code;
    try{
        code = await Code.findById(codeId).populate('creator');
    }catch (e) {
        return next(new HttpError("Something go wrong", 500));
    }

    if (!code) {
        return next(new HttpError("Could not find by id, please try again", 404));
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await code.remove({session: session});
        code.creator.codes.pull(code);
        await code.creator.save({session: session});
        await session.commitTransaction();
    }catch (e) {
        return next(new HttpError("Something go wrong", 500));
    }

    res.status(200).json({message: "Deleted"});
}

exports.getCodeById = getCodeById;
exports.getCodesByUserId = getCodesByUserId;
exports.createCode = createCode;
exports.updateCode = updateCode;
exports.deleteCode = deleteCode;


