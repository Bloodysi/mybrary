const { Router } = require('express')
const router = Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../models/user')
const {isNotLogin} = require('../lib')

router.get('/login', isNotLogin,(req, res)=>{
    res.render('user/login')
})

router.get('/register', isNotLogin,(req, res)=>{
    res.render('user/register')
})

// LOGIN POST

router.post('/login',isNotLogin,passport.authenticate('local',{
    failureRedirect: '/user/login',
    successRedirect: '/'
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

//LOGOUT

router.get('/logout', (req, res)=>{
    req.logOut()
    res.redirect('/user/login')
})
module.exports = router