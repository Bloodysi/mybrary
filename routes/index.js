const {Router} = require('express')
const router = Router()
const {isLogin} = require('../lib')
const Book = require('../models/books')
        
router.get('/',isLogin, async (req, res)=>{
    let books
    try {
        books = await Book.find({user_id: req.user.id}).sort({ createdAt: -1 }).limit(10)
    } catch {
        books = []
    }
    res.render('main',{books: books})
})

module.exports = router