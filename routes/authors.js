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
        res.redirect(`/authors/:${newAuthor.id}`)

    } catch (error) {
        console.error(error)
        res.render('authors/new',{
            author: author,
            errorMessage: 'Error creating author'
        })
    }
})

//GET AUTHOR ROUTE
router.get('/:id',(req, res)=>{
    res.send('Author view: '+ req.params.id)
}) 


//EDIT AUTHOR ROUTE
router.get('/:id/edit',async (req, res)=>{
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author: author})
    } catch {
        res.redirect('/authors')
    }
}) 

//UPDATE AUTHOR ROUTE
router.put('/:id',async (req, res)=>{
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
            res.render('authors/edit',{
                author: author,
                errorMessage: 'Error updating author'
            })
        }
        
    }
}) 


//DELETE AUTHOR ROUTE
router.delete('/:id', async (req, res)=>{
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