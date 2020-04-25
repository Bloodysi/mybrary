if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//EXPRESS CONTENT
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const app = express()

//OTHER CONTENT
const morgan = require('morgan')
const methodOverride = require('method-override')
const path = require('path')

//ROUTES PATH
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

//DB
require('./db')

//SETTIGNS
app.set('port', process.env.PORT || 3001)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

//MIDDLEAWARES
app.use(morgan('dev'))  
app.use(ejsLayouts)
app.use(express.urlencoded({extended: false, limit: '10mb'}))
app.use(methodOverride('_method'))

//ROUTES
app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

//STATIC FILES
app.use(express.static('public'))

//ON!
app.listen(app.get('port'), ()=>{
    console.log('server on!')
})