//CRUD create/read/update/delete

// const mongodb=require('mongodb')
// const MongoClient=mongodb.MongoClient
// const ObjectID=mongodb.ObjectID

// const {MongoClient,ObjectID, Db}=require('mongodb')  //shorthand for first 3 lines
// const connectionURL='mongodb://127.0.0.1:27017'
// const databaseName='task-manager'


// MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
//    if(error){
//        return console.log("Enable to run")   //use this return keyword thus no need of else block
//    }
//         const db=client.db(databaseName)  //db referencing to our database
// //     db.collection('users').insertMany([{  //Database consists of combination of collections,collection consits of relevant entries
// //        name:'Ayush',                   //Here we created a collection users and inserted into it(always object)
// //        age:20
// //    },{
// //        name:'Advait',
// //        age:20
// //     }],(error,result)=>{
// //        if(error){
// //            console.log("Entry not inserted")
// //        }else{
// //            console.log(result.ops)
// //        }
// //    })   // db.collection('users').insertMany scope terminated new collection can be made on the new line.
    
//     //******C:INSERING BY USING PROMISES INSTEAD OF CALLBACK******
//     //   db.collection('users').insertOne({name:'Aryan',age:10}).then((result)=>{}).catch((error)=>{console.log("Error")})
    

//     //*******R:READING*******
//     //   db.collection('users').findOne({_id:new ObjectID('616842bdef40e0f17efca55c')},(error,user)=>{
//     //       if(error){
//     //           console.log("Enable to find")
//     //       }else{
//     //           console.log(user)
//     //       }
//     //   })
//     //   db.collection('users').find({name:"Ayush"}).toArray((error,users)=>{
//     //         console.log(users)
//     //   })

//     //****U:UPDATING USING PROMISES*****
//     // db.collection('users').updateOne({_id:new ObjectID("616987cf15b5a7ccb836352a")},{$set:{age:12}}).then((result)=>
//     // {console.log(result)}).catch((error)=>{console.log(error)})
//     // db.collection('users').updateMany({   
//     //     //age:20    //when passes age as 20 updated all entries with age 20 to age+1
//     //                 //when left the filter parameter blank increases all ages to age+1 i.e for all entries
//     // },
//     // {
//     //     $inc:{
//     //         age:1
//     //     }
//     // }).then((result)=>
//     // {console.log(result)}).catch((error)=>{console.log(error)})

//     //*******D:Deleting********
//     db.collection('users').deleteMany({age:22}).then((result)=>{console.log(result)}).catch((error)=>{console.log(error)})
//     db.collection('users').deleteOne({age:13}).then((result)=>{console.log(result)}).catch((error)=>{console.log(error)})
// })  //Callback runs when the connection to the database is made





// //Finding for a document that does not exist leads to the null output.
