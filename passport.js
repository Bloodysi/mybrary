const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')
const bcrypt = require('bcrypt')



passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},async (username, password, done)=>{

    const user = await User.findOne({username: username})
    if(!user){                
        done(null, false)
    }else{
        const match = await bcrypt.compare(password, user.password)
        if(match){
            done(null, user)
        }else{
            done(null, false)
        }
    }    

}))
    
passport.serializeUser((user, done) =>{
    done(null, user.id)
})


passport.deserializeUser( async function(id, done){
    User.findById(id, (err, user)=>{
        done(err, user)
    })
})