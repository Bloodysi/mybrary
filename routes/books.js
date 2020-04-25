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


//SHOW BOOKS ROUTE
router.get('/:id', async (req, res)=>{
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show',{
            book: book
        })
    } catch{
        res.redirect('/')
    }
})

//EDIT BOOK ROUTE

router.get('/:id/edit', async (req, res)=>{
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    } catch {
        res.redirect('/')
    }
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
        res.redirect(`/books/${newBook.id}`)
    }catch{
        renderNewPage(res, book, true)
    }
})

//UPDATE BOOK ROUTE

router.put('/:id', async (req, res)=>{
    let book
    try{
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = req.body.publishDate
        book.pageCount= req.body.pageCount
        book.description= req.body.description
        if(req.body.cover != null && req.body.cover !== ''){
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    }catch (e){
        console.error(e)
        if(book != null){
            renderEditPage(res, book, true)
        }else{
            res.redirect('/')
        }
    }
})

// DELETE BOOK ROUTE

router.delete('/:id', async (req, res)=>{
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch {
        if(book != null){
            res.render('books/show',{
                book: book,
                errorMessage: 'Could not delete the book'
            })
        }else{
            res.redirect('/')
        }
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
    renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false){
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form ,hasError = false){
    try{
        const authors = await Author.find({})
        const params ={
            authors: authors,
            book: book
        }
        if(hasError){
            if(form === 'new'){
                params.errorMessage = 'Error creating a book'
            }else{
                params.errorMessage = 'Error updating the book'
            }
        }
        res.render(`books/${form}`, params)
    }catch{
        res.redirect('/books')
    }
}

module.exports = router