if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//EXPRESS CONTENT
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const app = express()

//OTHER CONTENT
const morgan = require('morgan')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const passport = require('passport')
const mongoStore = require('connect-mongo')(session)
const path = require('path')

require('./passport')

//ROUTES PATH
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
const userRouter = require('./routes/user')

//DB
const mongoose = require('mongoose')
require('./db')

//SETTIGNS
app.set('port', process.env.PORT || 3000)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

//MIDDLEAWARES
app.use(morgan('dev'))  
app.use(session({
    secret: 'blabla',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({mongooseConnection: mongoose.connection})
}))
app.use(ejsLayouts)
app.use(express.urlencoded({extended: false, limit: '10mb'}))
app.use(methodOverride('_method'))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

//GLOBAL VARIABLES
app.use((req, res, next)=>{
    res.locals.errorMessage = req.flash('error')
    res.locals.user = req.user
    next()
})

//ROUTES
app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)
app.use('/user', userRouter)

//STATIC FILES
app.use(express.static('public'))

//ON!
app.listen(app.get('port'), ()=>{
    console.log('server on!')
})