const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const codeSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    creator: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
})

module.exports = mongoose.model('Code', codeSchema);
