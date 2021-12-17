const express=require('express')
const User = require("../models/user") 
const router = new express.Router()
const auth=require('../middleware/auth')
const Task=require('../models/task')
const sharp = require('sharp')
const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/accounts')
//sendWelcomeEmail=objectName.sendWelcomeEmail



const multer=require('multer')

const upload=multer({
    //dest:'avatars',      //An avatars directory would be created where the files would be stored
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){                                         // a) \ -> start  b) $ -> end c)/.../ -> syntactical d) | -> or
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){                      
            return cb("Please upload proper file :)")
        }                                   
        cb(undefined,true)    
    }
})  
                               //middleware
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{  //multer looks for the file avatar in the req i.e key=avatar value=file(postman)
    //req.file-> Multer sends everything with req.file to the route handler (NOTE: dest should not be used to enable this)
    
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer() 
    
    req.user.avatar=buffer
    await req.user.save()
    
    res.send()
},(error,req,res,next)=>{      //The last function works when some error is thrown either by route paramaters/middleware/route handler
    res.status(400).send({error:'Something went wrong'})  //Function syntax must be the same 
})   


router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})


router.get('/users/:id/avatar',async (req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user || !user.avatar){
             throw new error()       //runs the catch block
        }
        res.set('Content-Type','image/png')  // imp
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})




// app.post("/users",(req,res)=>{       //As we sending data to the route
//     const user=new User(req.body)    //req.body :Body of the post request consisting of the user info in Json format
//     user.save().then(()=>{     
//         res.status(201).send(user)
//     }).catch((e)=>{
//           res.status(400)
//           res.send(e)      //res.status(400).send(e)
//     })
//     //res.send(req.body)
//     //res.send("testing")
// })
//via async await
                                                             
// router.get("/users",auth,(req,res)=>{    //middleware
//     User.find({}).then((users)=>{    //find({}) we have not provided any parameter thus this returns an array of objects with all entries
//        res.send(users)               //READ_R
//     }).catch(()=>{
//         res.status(500).send()
//     })
// })   //This would show the profile of other users as well to other users

router.get('/users/me',auth,async (req,res)=>{   //After the auth is made
    res.send(req.user)    //*************Shows the user his own profile only******************
})

router.post('/users/logout',auth,async (req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })                         //We remove that token from the tokens array as the user is logging out
        await req.user.save()      //saving the changes as the array is altered
        res.send()                 
    }catch(e){
        res.status(500).send()    
    }
})    //Logging out of a session froma particular device 
    // logged out fromNetflix account on a particular device 


router.post('/users/logoutAll',auth,async (req,res)=>{
    try{
          req.user.tokens=[]         //logging out the users accout from all devices(removing all the tokens)
          await req.user.save()      //saving the changes as the array is altered
          res.send()
    }catch(e){
          res.status(500).send()
    }
})
//All Authentication tokens of user are deleted
//Everyone gets logged out from ur Netflix account on their device 



router.post("/users",async (req,res)=>{                //signup(No authentication required)
    const user=new User(req.body)           //user data is sent through the body of post req
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token=await user.generateAuthToken()  //We provide user with token when he signs iin
        res.status(201).send({user,token})
    }catch(e){
        res.status(400)
        res.send(e) 
    }
    
})
router.post('/users/login', async(req, res)=>{          //login(No authentication required)
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password) //calling the userSchema.statics.findByCredentials
        const token = await user.generateAuthToken()  //Provide token when user logs in
       // res.send(user)
       res.send({ user, token }) //When the client login we provide them a token which they can use to perform other activities that require authentication 
    }catch(e){
        res.status(400).send()
    }
})

// router.get("/users/:id",async (req,res)=>{
//     const _id=req.params.id
//     try{
//         const user=await User.findById(_id)
//         if(!user)
//         {
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch(e){
//         res.status(500).send()
//     }
    
// })
router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
      
    try {
       // const user = await User.findById(req.params.id)   //No need we got the user with request(req.user)

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

       // if (!user) {
         //   return res.status(404).send()
       // }

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.patch("/users/:id",async (req,res)=>{
    const updates=Object.keys(req.body)   //field (key:value) pairs to be updated of an entry are in a object
    //All the keys specified are put into the aray updates
    const allowedupdates=['name','email','password','age']  //only these keys would be allowed with the patch request(for updation)
    const isvalidoperation=updates.every((update)=>{return allowedupdates.includes(update)})
    //All values in updates are compared with allowedupdates (function returns boolean)

    if(!isvalidoperation)
    {
        return res.status(404).send()
    }
    try{
        const _id=req.params.id
        const user=await User.findById(_id)
        updates.forEach((update)=>{
        user[update]=req.body[update]   //dynamic
        })
        await user.save()
        //const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}) //req.body {name:"Ayush"} altering the field
        if(!user){
           return res.status(404).send()
        }
        //console.log(user)
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})


router.delete('/users/me',auth,async (req,res)=>{     
   // const user=await User.findByIdAndDelete(req.user._id)    
    try{
        // if(!user){
        //     return res.status(400).send()
        // }                                 //commented code is also fine 
        await Task.deleteMany({owner:req.user._id})       //Deleted all tasks of the user to be deleted
        await req.user.remove()
        res.send(req.user)                 //In auth we have send the user with the request
        sendCancellationEmail(req.user.email,req.user.name)
    }catch(e){
        res.status(500).send()
    }
})
module.exports = router


//Created the instance of the model User and saved it to the users collection in the database


//726fa3dd4a6c48f7a08a6086139dcca3