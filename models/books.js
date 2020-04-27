const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'authors',
        required: true,
    },
    coverImage:{
        type: Buffer,
        required: true
    },
    coverImageType:{
        type: String,
        required: true
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        default: 'future',
        required: true
    }

})

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf-8;base64,
        ${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('books', bookSchema)
