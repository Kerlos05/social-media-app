const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    friendsTo:{
        type: [String],
        required: true,
    },
    image: {
        type: String
    },
    
});

module.exports = mongoose.model('User', userSchema);