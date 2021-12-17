const express=require('express')
const app=express()
require('./db/mongoose')  
app.use(express.json())
const port=process.env.PORT || 3000
const User=require('./models/user')
const Task=require('./models/task')
// app.use((req,res,next)=>{
//     if(req.method === 'GET'){
//         res.send("GET requests are disabled")  //If the client requests the get route
//     }else{
//         next()   //This is important to get out of middleware to the route handler ir else we are going to stay there for ever
//     }
// })
// app.use((req,res,next)=>{
//     res.status(503).send('Site is under maintainence')    //If the client requires any route
// })



const multer=require('multer')

const upload=multer({
    dest:'images',      //An images directory would be created where the files would be stored
    limits:{
                fileSize:1000000
    },                                                                //using regex(regular expressions)  /.(doc|docx)$/
    fileFilter(req,file,cb){                                         // a) \ -> start  b) $ -> end c)/.../ -> syntactical d) | -> or
        if(!file.originalname.match(/\.(doc|docx)$/)){                        // file name must end with doc or docx
            return cb("Please upload word document")
        }                                   
        cb(undefined,true)      //If things go well
    }
})

app.post('/upload',upload.single('upload'),(req,res)=>{  //multer looks for the file send with key upload in the req i.e key=upload value=file(postman)
    res.send()
},(error,req,res,next)=>{      //The last function works when some error is thrown either by route paramaters/middleware/route handler
    res.status(400).send({error:'Something went wrong'})  //Function syntax must be the same 
})      
//postman->body->form data



const jwt=require('jsonwebtoken')

const userRouter = require('./routers/user')
app.use(userRouter) 

const taskRouter = require('./routers/task')
app.use(taskRouter)


const myFunction=async ()=>{
    const token=jwt.sign({_id:'abc123'},'HelloWorld',{expiresIn:'7 days'})
    console.log(token)

    const data=jwt.verify(token,'HelloWorld')
    console.log(data)
}


//myFunction()

//Express Middleware

//Without Middleware : new req->Run route handler
//With Middleware : new req->Do something->Run route handler

// const main= async()=>{
//     const user=User.findById('61b743cd974e3f5493b974ad')
//     await user.populate('tasks').execPopulate() //This stores all the tasks associated with the user and stores it in the user.tasks
//     console.log(user.tasks)
// }
// main()
app.listen(port,()=>{
    console.log("Server started")
})




