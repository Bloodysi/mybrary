if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//EXPRESS CONTENT
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const app = express()

//OTHER CONTENT


//ROUTES PATH
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')

//DB
require('./db')

//SETTIGNS
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

//MIDDLEAWARES
app.use(ejsLayouts)
app.use(express.urlencoded({extended: false, limit: '10mb'}))

//ROUTES
app.use('/', indexRouter)
app.use('/authors', authorRouter)

//STATIC FILES
app.use(express.static('public'))

//ON!
app.listen(3000, ()=>{
    console.log('server on!')
})