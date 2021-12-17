const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')




const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true, //Takes care that everyone logs(uses) an unique email
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens:[{
        token:{
                type:String,
                required:true
        }
    }],
    avatar:{
        type:Buffer
    }
 },{
     timestamps:true    //Note this is the second parameter passed to the schema
 })

   
 
 
    userSchema.virtual('tasks',{     
        ref:'Task',
        localField:'_id',       //This field of User is in association with Task
        foreignField:'owner'    //This field of Task is in association with User
    })



    userSchema.methods.toJSON=function(){
        const user=this
        const userObject=user.toObject()    //Converting json data to raw data

        delete userObject.password
        delete userObject.tokens    //Sending only necessary data back
        delete userObject.avatar     //we are not sending it back

        return userObject
    }




    userSchema.methods.generateAuthToken=async function(){
        const user=this
        const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
        //return token
        user.tokens=user.tokens.concat({token})  //token:token
        await user.save()
        return token
    }





    userSchema.statics.findByCredentials = async (email, password) =>{
    const user = await User.findOne({email: email}) //finding a user with the given email

    if(!user){
        throw new Error('unable to login')  //no user found
    }
     
    const isMatch = await bcrypt.compare(password, user.password)  //bcrypt.compare takes 2 args, 1st: plainTextPassword 2nd: hashedPassword
    //Checking if the password matches
    if(!isMatch){
        throw new Error('unable to login')
    }
    return user
    
}


//Just before the user is removed the database we also delete all the tasks of that particular user
// userSchema.pre('remove',async function (next){
//       const user=this
//       await Task.deleteMany({owner:user._id})
//       next()
// })
//Did it in the router.delete itself (did not use this method)




userSchema.pre('save', async function (next) {            //Just before I save this must happen(callback) 
    const user = this    //pointing to the current entry

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8)    //hashing the newly entered password
    }

    next()
})
//Just before the user is saved to the users collection we hash the password (Middleware enables us)



const User = mongoose.model('User', userSchema)

module.exports = User


//Everytime we create a entry for a model initially that schema is created
//So we are here basically authenticating the user before the userSchema is created or entry is created in that colletion
//userSchema===Schema for entries under the user model 
