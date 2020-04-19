const {Router} = require('express')
const router = Router()

const Author = require('../models/authors')

//ALL AUTHORS ROUTE
router.get('/', async (req, res)=>{
    let searchOption = {}

    if (req.query.name != null && req.query.name !== ''){
        searchOption.name = new RegExp(req.query.name, 'i')        
    }    

    try {
        const authors = await Author.find(searchOption)
        res.render('authors/index', {
            authors: authors,
            searchOption: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//NEW AUTHOR ROUTE

router.get('/new', (req, res)=>{
    res.render('authors/new', {author: new Author()})
})

//CREATE AUTHOR ROUTE

router.post('/',async (req, res)=>{
    const author = new Author({
        name: req.body.name
    })
    try {        
        const newAuthor = await author.save()
        //res.redirect('authors/:${newAuthor.id}')
        res.redirect('authors')

    } catch (error) {
        console.error(error)
        res.render('authors/new',{
            author: author,
            errorMessage: 'Error creating author'
        })
    }
})

module.exports = router