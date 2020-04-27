const { Router } = require('express')
const router = Router()
const {isLogin,isNotLogin} = require('../lib')

const User = require('../models/user')
const Author = require('../models/authors')
const Book = require('../models/books')
const Follow = require('../models/follow')

//SOCIAL GET

router.get('/', isLogin, async (req, res)=>{
    let searchOption = {}
    let users
    if (req.query.username != null && req.query.username !== ''){
        searchOption.username = new RegExp(req.query.username, 'i')        
    }    

    try {
        if(searchOption.username){
            users = await User.find(searchOption)
        }else{
            users = await User.find({})
        }
        
        res.render('social/index', {
            users: users,
            searchOption: req.query
        })
    } catch {
        res.redirect('/')
    }
})


// SOCIAL USER GET

router.get('/user/:id', async (req, res)=>{
        let statusFollow
    try {        
        const user = await User.findById(req.params.id)
        const authors = await Author.find({user_id: req.params.id})
        const books = await Book.find({user_id: req.params.id}).sort({ createdAt: -1 })
        const readBooks = await Book.find({$and:[{user_id: req.params.id},{status: 'read'}]})
        const readingBooks = await Book.find({$and:[{user_id: req.params.id},{status: 'reading'}]}).limit(2)
        const userFollowers = await Follow.find({user_to: req.params.id})
        const userFollowing = await Follow.find({user_from: req.params.id})
        const follow = await Follow.findOne({$and:[{user_from: req.user.id},{user_to: req.params.id}]})
        if(follow != null){
            statusFollow = 'unfollow'
        }else if(follow == null){
            statusFollow = 'follow'
        }

        if(req.params.id === req.user.id){
            res.redirect('/user/profile')
        }else{
            res.render('social/user',{
                user: user,
                authors: authors,
                books: books,
                readingBooks: readingBooks,
                readBooks: readBooks,
                userFollowers: userFollowers,
                userFollowing: userFollowing,
                statusFollow: statusFollow
            })
        }
    } catch  {
        res.redirect('/')
    }
})

module.exports = router