const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    image: {type: String, default: 'https://cdn.pixabay.com/photo/2022/03/02/10/23/ukraine-7042810__340.png'},
    codes: [{type: Schema.Types.ObjectId, required: true, ref: 'Code'}]
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
