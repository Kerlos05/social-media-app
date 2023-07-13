const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    avatar: {
        type: [String]
    },
});

module.exports = mongoose.model('FeeDetails', feedSchema);