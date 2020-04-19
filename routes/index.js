const {Router} = require('express')
const router = Router()

const Book = require('../models/books')

router.get('/', async (req, res)=>{
    let books
    try {
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10)
    } catch {
        books = []
    }
    res.render('main',{books: books})
})

module.exports = router