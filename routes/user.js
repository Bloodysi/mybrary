const { Router } = require('express')
const router = Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const {isNotLogin} = require('../lib')

const User = require('../models/user')
const Author = require('../models/authors')
const Book = require('../models/books')

const categories = [
    'Action and Adventure',
    'Anthology',
    'Classic',
    'Comic and Graphic Novel',
    'Business',
    'Crime and Detective',
    'Drama',
    'Fable',
    'Horror',
    'Humor',
    'Romance',
    'Science Fiction (Sci-Fi)',
    'Fantasy',
    
]
//LOGIN GET

router.get('/login', isNotLogin,(req, res)=>{
    res.render('user/login')
})

// REGISTER GET

router.get('/register', isNotLogin,(req, res)=>{
    res.render('user/register')
})

// LOGIN POST

router.post('/login',isNotLogin,passport.authenticate('local',{
    failureRedirect: '/user/login',
    successRedirect: '/user/profile'
}) )

//REGISTER POST

router.post('/register', isNotLogin,async (req, res)=>{
    let user = new User({
        username: req.body.username
    })    
    try {
        if(req.body.repeatPassword === req.body.password){
            user.password = await bcrypt.hash(req.body.password, 1)
        }else{
            res.render('user/register',{
                errorMessage: 'Password do not match'
            })
        }
        await user.save()
        res.redirect('/')        
    } catch {
        res.redirect('/user/register')
    }
})


//USER UPDATE

router.put('/:id', async (req, res)=>{

    try{
        let user = await User.findById(req.params.id)
        user.categorie = req.body.categorie
        user.about = req.body.about
        user.save()
        res.redirect('/user/profile')
    }catch{
        res.redirect('/user/profile')
    }
})

// PROFILE GET

router.get('/profile', async (req, res)=>{
    try {        
        const user = await User.findById(req.user.id)
        const authors = await Author.find({user_id: req.user.id})
        const books = await Book.find({user_id: req.user.id}).sort({ createdAt: -1 })
        const readBooks = await Book.find({$and:[{user_id: req.user.id},{status: 'read'}]})
        const readingBooks = await Book.find({$and:[{user_id: req.user.id},{status: 'reading'}]}).limit(2)
        res.render('user/profile',{
            user: user,
            authors: authors,
            books: books,
            readingBooks: readingBooks,
            readBooks: readBooks
        })
    } catch  {
        res.redirect('/')
    }
})


//SETTIGNS

router.get('/settings',(req, res)=>{
    res.render('user/settings',{
        categories: categories
    })
})

//LOGOUT

router.get('/logout', (req, res)=>{
    req.logOut()
    res.redirect('/user/login')
})
module.exports = router