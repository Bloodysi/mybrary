const mongoose = require('mongoose')

mongoose.connect(DATABASE_URL,{
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