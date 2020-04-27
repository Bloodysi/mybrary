const mongoose = require('mongoose')


const followSchema = new mongoose.Schema({
    user_to:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user_from:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

module.exports = mongoose.model('follow', followSchema)