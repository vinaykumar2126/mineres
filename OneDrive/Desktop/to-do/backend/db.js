const mongoose = require("mongoose");


mongoose.connect('mongodb://127.0.0.1:27017/Todos')
.then(()=>console.log("Mongo connected"))
.catch((err)=>console.error("error",err));

const todoSchema = mongoose.Schema({
    title:String,
    description:String,
    completed:Boolean
})

const todo = mongoose.model('todos',todoSchema);

module.exports={
    todo
};