const {Router} = require('express')
const router = Router()
const path = require('path')
const Author = require('../models/authors')
const Book = require('../models/books')
const ImageMimeTypes = ["image/jpeg", "image/png", "image/gif"]

//ALL BOOKS ROUTE
router.get('/', async (req, res)=>{
    let searchOption = {}
    if (req.query.title != null && req.query.title != '') {
      searchOption.title = new RegExp(req.query.title, 'i')
    }
    try{
        const books = await Book.find(searchOption)
        res.render('books/index',{
            books: books,
            searchOption: req.query
        })
    }catch{
        res.redirect('/')
    }
})

//NEW BOOK ROUTE

router.get('/new', async (req, res)=>{
   renderNewPage(res, new Book())
})

//CREATE BOOK ROUTE

router.post('/', async (req, res)=>{
    const {title, author, publishDate, pageCount , description,} = req.body
    const book = new Book({
        title,
        author,
        publishDate: new Date(publishDate),
        pageCount,
        description
    })
    saveCover(book, req.body.cover)
    console.log(req.body.cover)
    try{
        const newBook = await book.save()
        //res.redirect('authors/:${newBook.id}')
        res.redirect('books')
    }catch{
        renderNewPage(res, book, true)
    }
})

//FUNCTIONS

function saveCover(book, coverEncoded){
    if(coverEncoded == null) return 
    const cover = JSON.parse(coverEncoded)
    if(cover != null && ImageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    } 

}


async function renderNewPage(res, book, hasError = false){
    try{
        const authors = await Author.find({})
        const params ={
            authors: authors,
            book: book
        }
        if(hasError) params.errorMessage = 'Error creating book'
        res.render('books/new', params)
    }catch{
        res.redirect('/books')
    }
}

module.exports = router