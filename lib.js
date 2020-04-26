module.exports ={
    isLogin: (req, res, next)=>{
        if(req.isAuthenticated()){
            next()
        }
        else{
            res.redirect('/user/login')
        }
    },

    isNotLogin: (req, res, next)=>{
        if(!req.isAuthenticated()){
            next()
        }
        else{
            res.redirect('/')
        }
    }
}