const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL,{
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