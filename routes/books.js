const {Router} = require('express')
const router = Router()
const fs = require('fs')
const path = require('path')
const Author = require('../models/authors')
const Book = require('../models/books')
const uploadPath = path.join('public', Book.coverImageBasePath)


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
    const fileName = req.file != null ? req.file.filename : null
    const {title, author, publishDate, pageCount , description,} = req.body
    const book = new Book({
        title,
        author,
        publishDate: new Date(publishDate),
        pageCount,
        coverImageName: fileName,
        description
    })

    try{
        const newBook = await book.save()
        //res.redirect('authors/:${newBook.id}')
        res.redirect('books')
    }catch{
        if(book.coverImageName != null){
            removeBookCover(fileName)
        }
        renderNewPage(res, book, true)
    }
})

//FUNCTIONS

function removeBookCover(filename){
    fs.unlink(path.join(uploadPath, filename), err=>{
        if(err) console.error(err)
    })
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