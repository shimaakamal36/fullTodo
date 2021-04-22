
const express = require('express')
const Model=require('../models/user')
const userModel=Model.User
const bcrypt=require('bcrypt')
const router = express.Router()
const jwt=require('jsonwebtoken')
const authMe=require('../middleware/verifytoken')
// router.get('/adduser',(req,res)=>{
//     res.render('adduser')
// })
router.post('/adduser',(req,res)=>{
        let  data=req.body
        let user=new userModel(data)
        user.save().then(()=>{ res.status(200).send({
            staus:true,
            result:user,
            message:'Message inserted successfully'
        })
        }).catch((e)=> {
         res.status(404).send({
            staus:false,
            error:e.message,
            message:'User can not be added'
         })
    })})
// router.get('/login',(req,res)=>{
//     res.render('login')
// })
router.post('/login',async (req,res)=>{
    try{
        let reqdata=req.body
        if(!(reqdata.email && reqdata.password )){throw new Error('please enter your credientials')}
        // reqdata.password=bcrypt.compare(reqdata.password)
        let  users= await userModel.findOne({email:reqdata.email})
        if(!users) throw new Error('User is not registered please sign up credientials')
        else{
            const isValid=await bcrypt.compare(reqdata.password,users.password)
            if(isValid)  {let token=jwt.sign(users._id.toString(),"secret")
                           users.tokens=users.tokens.concat({token})
                           await users.save() 
                        //    res.status(200).render('tok',{data:users.tokens})}
                         res.status(200).send({
                             status:'success',
                             data:users,
                             message:'You have signed in successfully'
                         })}
            else   throw new Error("Your password is invalid")
        }
    }
    catch(e){
        res.status(404).send({
            staus:false,
            error:e.message,
            message:'User can not login'}
         )
        } 
})
router.get('/profile', authMe, async(req,res)=>{
    res.send(req.user)
})
router.post('/logout',authMe,async(req,res)=>{
  try{
    req.user.tokens=req.user.tokens.filter(tok=>{
        return tok.token!==req.token
    })
    await req.user.save()
    res.send('logout')
  }
  catch(e){        
      res.status(401).send({
        staus:false,
        error:e.message,
        message:'User can not be log out'}
     )
  }
})
router.get('/users/:id',async(req,res)=>{
    try{
        let _id=req.params.id
        let user=await userModel.findById(_id)
        if(!user) throw new Error ('User is not exist')
        else res.status(200).send({
            status:true,
            message:'success',
            data:user
        })
    }
    catch(e){
        res.status(404).send({
            staus:false,
            error:e.message,
            message:'User can not be get'}
         )   }
   
})
//patch used to change some elements in the entry but not all of them 
//put change all elements(properity) in the entry
router.patch('/users/:id',async(req,res)=>{
try{
    let heads=['age','name','email','password']
    let reqheads=Object.keys(req.body)
    let valid=reqheads.every(head=> heads.includes(head))
    console.log(valid)
    if(!valid) res.status(500).redirect('/error')
    else {
        // let user =await userModel.findByIdAndUpdate(req.params.id,req.body,{
        //     runValidators:true , new:true})
        let user =await userModel.findById(req.params.id)
        if(!user)  throw new Error ('User is not found')
        else {
            reqheads.forEach(head=>{
                user[head]=req.body[head]
            })
            await user.save()
            res.status(200).send({
                status:true,
                data:user,
                message:'User has been updated'
            })
        }
     
    }   
}
catch(e){
    res.status(404).send({
        status:false,
        error:e.message,
        message:'User can not be updatd'

    })
}
})
router.get('/users',async(req,res)=>{
    try{
        let users= await userModel.find()
        res.status(200).send({
                staus:true,
                data:users,
                message:'Users has been retrieved '
             
        })
    }
    catch(e){
        res.status(404).send({
                staus:fasle,
                error:e.message,
                message:'Users can not be retrieved '
             
        })
    }
   
}) 

router.delete('/users/:id',authMe,async(req,res)=>{
    try{
            let task =await userModel.findById(req.params.id)
            if(!task)  throw new Error ('User not found')
            else if(req.params.id === (req.user._id).toString()) {
                 let todo=await userModel.deleteOne({_id:req.params.id})
//                    
                 
                res.status(200).send({
                    status:true,
                    data:todo,
                    message:'User has been removed'
                })
            }
            else throw new Error ('user is unauthorized to delete User')  
    }
    catch(e){
        res.status(404).send({
            status:false,
            error:e.message,
            message:'User can not be removed'
    
        })
    }
    })

module.exports = router;