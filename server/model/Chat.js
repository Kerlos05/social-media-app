
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    username:{
        type: String, 
        required: true,
    },
    message: {
        type: [[]],
        default: [], 
    }
})

module.exports = mongoose.model('Chat', chatSchema);
