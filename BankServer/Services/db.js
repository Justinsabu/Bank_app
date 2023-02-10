// Server -mogodb Integration

//1 import mogoose

const mongoose =require('mongoose')

//2 state connection via mongoose

mongoose.connect('mongodb://localhost:27017/BankServer',{
    useNewUrlParser:true
})

// 3 Define bank model

const  User=mongoose.model('User',{
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
})

module.exports={
    User
}