const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/mybrary',{
    useNewUrlParser: true,
    useUnifiedTopology:true
})

let db = mongoose.connection

db.on('error', err=>{
    console.error(err)
})

db.once('open', ()=>{
    console.log('DATABASE CONNECTED')
})