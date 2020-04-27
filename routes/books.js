const {Router} = require('express')
const router = Router()
const path = require('path')
const Author = require('../models/authors')
const Book = require('../models/books')
const ImageMimeTypes = ["image/jpeg", "image/png", "image/gif"]

const {isLogin} = require('../lib')

const status = ['future', 'reading', 'read']

//ALL BOOKS ROUTE
router.get('/',isLogin, async (req, res)=>{
    let searchOption = {}
    let books
    if (req.query.title != null && req.query.title != '') {
      searchOption.title = new RegExp(req.query.title, 'i')
    }
    try{
        if(searchOption.name){
            books = await Book.find(searchOption)
        }else{
            books = await Book.find({user_id: req.user.id})
        }
        res.render('books/index',{
            books: books,
            searchOption: req.query
        })
    }catch{
        res.redirect('/')
    }
})

//NEW BOOK ROUTE

router.get('/new',isLogin, async (req, res)=>{
   renderNewPage(res, req, new Book())
})


//SHOW BOOKS ROUTE
router.get('/:id',isLogin, async (req, res)=>{
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

router.get('/:id/edit',isLogin, async (req, res)=>{
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, req, book)
    } catch {
        res.redirect('/')
    }
 })

//CREATE BOOK ROUTE

router.post('/',isLogin, async (req, res)=>{
    const {title, author, publishDate, pageCount , description, status} = req.body
    const book = new Book({
        title,
        author,
        description,
        status,
        user_id: req.user.id
    })
    console.log(req.body)
    if(!req.body.cover){
        return req.flash('error', 'Choose a image')
    }else{
        saveCover(book, req.body.cover)
    }
    console.log(book)
    try{
        const newBook = await book.save()
        res.redirect(`/books/${newBook.id}`)
    }catch{
        renderNewPage(res, req, book, true)
    }
})

//UPDATE BOOK ROUTE

router.put('/:id', isLogin,async (req, res)=>{
    let book
    try{
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.description= req.body.description
        book.status = req.body.status
        if(req.body.cover != null && req.body.cover !== ''){
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    }catch (e){
        console.error(e)
        if(book != null){
            renderEditPage(res, req, book, true)
        }else{
            res.redirect('/')
        }
    }
})

// DELETE BOOK ROUTE

router.delete('/:id',isLogin, async (req, res)=>{
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


async function renderNewPage(res, req, book, hasError = false){
    renderFormPage(res, req, book, 'new', hasError)
}

async function renderEditPage(res, req, book, hasError = false){
    renderFormPage(res, req, book, 'edit', hasError)
}

async function renderFormPage(res, req, book, form ,hasError = false){
    try{
        const authors = await Author.find({user_id: req.user.id})
        const params ={
            authors: authors,
            book: book,
            status: status
        }
        if(hasError){
            if(form === 'new'){
                params.errorMessage = 'A fill is missing'
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