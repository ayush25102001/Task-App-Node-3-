const express=require('express')
const Task = require('../models/task')
const auth=require('../middleware/auth')
const router = new express.Router()






//GET tasks?completed=true
// router.get("/tasks",auth,async (req,res)=>{
//     const status=req.query.completed
//     try{                                              
//         const tasks=await Task.find({owner:req.user._id,completed:status})    
//         if(!tasks)
//         {
//             return res.status(404).send()
//         }
//         res.send(tasks)
//     }catch(e){
//         res.status(500).send()
//     }
// })

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})









router.post("/tasks",auth,async (req,res)=>{
    //const task=new Task(req.body)    //CREATE_C

    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
          res.status(400)
          res.send(e)      
    }
    
})
router.get("/tasks/:id",auth,async (req,res)=>{
    const _id=req.params.id
    try{        //This makes sure that the task with the given id belongs to that user only
        const task=await Task.findOne({_id, owner:req.user._id})   //_id:_id 
        if(!task)
        {
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
    
})



router.patch("/tasks/:id",auth,async (req,res)=>{
    const updates=Object.keys(req.body)  
    const allowedupdates=['description','completed']
    const isvalidoperation=updates.every((update)=>allowedupdates.includes(update))
    if(!isvalidoperation)
    {
        return res.status(404).send()
    }
    try{
        //const task=await Task.findById(req.params.id)
        //const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}) //req.body {name:"Ayush"} altering the field
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task){
           return res.status(400).send()
        }
        
        updates.forEach((update)=>{task[update]=req.body[update]})
        await task.save()
        res.send(task)
    }catch(e){
        res.status(404).send(e)
    }
})

router.delete("/tasks/:id",auth,async (req,res)=>{
    const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
    try{
        if(!task){
            return res.status(400).send()
        }
        res.send(task)
    }catch(e){
        res.status(404).send(e)
    }
})

module.exports = router

//Via promises








// app.get("/users/:id",(req,res)=>{   //Here we are going to find using id as a key
//       //console.log(req.params)   //return an with object({id:"7728773"})  only id here as we have just given that with route parameters
//       const _id=req.params.id
//       User.findById(_id).then((user)=>{
//           if(!user){
//               return res.status(404).send()
//           }
//           res.send(user)
//       }).catch(()=>{
//         res.status(500).send()
//     })
//     })



   
