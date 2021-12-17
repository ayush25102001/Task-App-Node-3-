const mongoose=require('mongoose')

//VALIDATOR HELPS US TO HAVE MORE CONTROL ON THE DATA WE SEND TO OUR DATABASE.
//process.env.MONGODB_URL
mongoose.connect(process.env.MONGODB_URL,{
    // useNewUrlParser:true,
    // useCreateIndex:true
})
//Mongoose is object data modelling

// const me=new User({  //Created a object(or a instance/entry) for the user model constructoor gets called.
//     name:'ayush',
//     age:20,
//     password:'ayushkangane',
//     email:'ayush@gmail.com'
// })
// me.save().then(()=>{  //Object entry is being saved to the database or an instance
//    console.log(me)
// }).catch((error)=>{
//    console.log(error)
// })

// const Task=mongoose.model('Task',{  //Created a model for user
//     description:{
//         type: String,
//         required:true,
//         trim:true
//     },
//     completed:{
//         type:Boolean,
//         default:false
//     }
//  })
 

//  const task=new Task({  
//     description:'I am mad!!',
//     completed: true
// })
// task.save().then(()=>{  
//    console.log(task)
// }).catch((error)=>{
//    console.log(error)
// })