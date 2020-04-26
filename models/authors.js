const mongoose = require('mongoose')
const Book = require('./books')

const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

authorSchema.pre('remove', function(next){
    Book.find({author: this.id}, (err, books)=>{
        if(err){
            next(err)
        }else if(books.length > 0){
            next(new Error('this author has books still'))
        }else{
            next()
        }
    })
})

module.exports = mongoose.model('authors', authorSchema)