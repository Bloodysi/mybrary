const { Router } = require('express')
const router = Router();

const Follow = require('../models/follow')
//FOLLOW

router.post('/follow/:id', async (req, res)=>{
    const  follow = new Follow({
        user_to: req.params.id,
        user_from: req.user.id
    })
    try{
        let follows = await Follow.findOne({user_to: req.params.id, user_from: req.user.id})
        if(follows != null){
            req.flash('')
            res.redirect(`/social/user/${req.params.id}`)
        }else{
            await follow.save()
            res.redirect(`/social/user/${req.params.id}`)
        }
        console.log(follows)
    }catch (e){
        res.redirect('/user/profile')
    }
})

//UNFOLLOW

router.post('/unfollow/:id', async (req, res)=>{
    try {
        const follow = await Follow.findOne({user_to: req.params.id, user_from: req.user.id})
        await follow.remove()
        res.redirect(`/social/user/${req.params.id}`)
    } catch {
        res.redirect('/user/profile')
    }
})

module.exports = router