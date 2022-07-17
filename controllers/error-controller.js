const HttpError = require("../models/HttpEror");


const errorController = (error, req, res, next) => {
    if (error.headerSent) {
        return next(error)
    }

    res.status(error.code || 500).json({message: error.message || 'Unknown error' });
}

const errorControllerForOther = (req, res, next) => {
    throw new HttpError('could not provide path', 404);
}

exports.errorController = errorController;
exports.errorControllerForOther = errorControllerForOther;
