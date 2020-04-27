const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    about:{
        type: String,
        required: false
    },
    categorie:{
        type: String,
        required: false
    }
})

module.exports = mongoose.model('user', userSchema)