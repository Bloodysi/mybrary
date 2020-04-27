const {Router} = require('express')
const router = Router()

const Author = require('../models/authors')
const Book = require('../models/books')
const User = require('../models/user')

const {isLogin} = require('../lib')

//ALL AUTHORS ROUTE
router.get('/', isLogin, async (req, res)=>{
    let searchOption = {}
    let authors
    if (req.query.name != null && req.query.name !== ''){
        searchOption.name = new RegExp(req.query.name, 'i')        
    }    

    try {
        if(searchOption.name){
            authors = await Author.find({$and:[{user_id: req.user.id}, searchOption]})
        }else{
            authors = await Author.find({user_id: req.user.id})
        }
        
        res.render('authors/index', {
            authors: authors,
            searchOption: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//NEW AUTHOR ROUTE

router.get('/new', isLogin, (req, res)=>{
    res.render('authors/new', {author: new Author()})
})


//SHOW AUTHOR ROUTE
router.get('/:id', isLogin, async (req, res)=>{
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author: author.id}).limit(6).exec()
        res.render('authors/show',{
            author: author,
            booksByAuthor: books
        })
    } catch{        
        res.redirect('/')
    }
}) 

//CREATE AUTHOR ROUTE

router.post('/',isLogin, async (req, res)=>{
    const author = new Author({
        name: req.body.name,
        user_id: req.user.id
    })
    try {        
        await author.save()
        res.redirect(`/authors`)

    } catch (error) {
        console.error(error)
        res.render('authors/new',{
            author: author,
            errorMessage: 'Error creating author'
        })
    }
})



//EDIT AUTHOR ROUTE
router.get('/:id/edit',isLogin, async (req, res)=>{
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author: author})
    } catch {
        res.redirect('/authors')
    }
}) 

//UPDATE AUTHOR ROUTE
router.put('/:id',isLogin, async (req, res)=>{
    let author 
    try {        
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/:${author.id}`)

    } catch {
        if(author == null){
            res.redirect('/')
        }
        else{
            req.flash('error', 'Error updating author')
            res.render('authors/edit',{
                author: author,
            })
        }
        
    }
}) 


//DELETE AUTHOR ROUTE
router.delete('/:id', isLogin, async (req, res)=>{
    let author
    try {        
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect(`/authors`)

    } catch {
        if(author == null){
            res.redirect('/authors')
        }
        else{
            res.redirect(`/authors/:${author.id}`)
        }
        
    }
}) 


module.exports = router