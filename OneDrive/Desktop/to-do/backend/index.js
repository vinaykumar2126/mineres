const express = require('express');
const {createTodo,updateTodo} =require("./types");
const {todo} = require("./db");
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());
//console.log("Request Body at Start of POST /todo:", req.body);

// app.use((req, res, next) => {
//     console.log(`Incoming Request: ${req.method} ${req.path}`);
//     console.log('Headers:', req.headers);
//     console.log('Body:', req.body);
//     next();
// });


console.log("Registering /todo routes");
app.post("/todo",async function(req,res){
    console.log("POst todo endpointhit");
    console.log("Request Body:", req.body);
    const createPayload = req.body;
    const parsedPayload = createTodo.safeParse(createPayload);
    if(!parsedPayload.success){
        console.log("Validation Failed:", parsedPayload.error);
        res.status(411).json({
            msg:"you sent the wrong inputs",
        })
        return;
    }
    //put in mongodb
    try {
        const newTodo = await todo.create({
            title: createPayload.title,
            description: createPayload.description,
            completed: false,
        });
        console.log("New Todo Added:", newTodo);
        res.json({
            msg: "todo created",
        })
    } catch (err) {
        console.error("MongoDB Error:", err); // Log MongoDB errors
        res.status(500).json({
            msg: "Database error",
        });
    }
})
    // await todo.create({
    //     title:createPayload.title,
    //     description:createPayload.description,
    //     completed:false
    // })
    // res.json({
    //     msg:"todo created"
    // })
    

app.get("/todo",async function(req,res){
    console.log("GET /todo endpoint hit");
    //const todos = await todo.find({});
    res.json({
        todos: []
    })

})
app.put("/completed",async function(req,res){
    const updatePayload = req.body;
    const parsedPayload = updateTodo.safeParse(updatePayload);
    if(!parsedPayload.success){
        res.status(411).json({
            msg:"you sent the wrong inputs",
        })
        return;
    }
    await todo.update({
        _id:req.body.id
    },{
        completed:true
    });
    res.json({
        msg:"Todo marked as completed"
    })
})

app.use((req, res, next) => {
    console.log(`Raw Request URL: ${req.url}`);
    next();
});


app.use((req, res, next) => {
    req.url = req.url.replace(/%0A/g, "").trim(); 
    // Remove extra whitespace or newlines from the URL
    console.log(`Sanitized Request URL: ${req.url}`);
    next();
});


// app.use((req, res) => {
//     console.log(`Unhandled request to: ${req.method} ${req.path}`);
//     res.status(404).json({ error: `Route ${req.path} not found` });
// });


app.listen(3000,()=>{
    console.log("server running at port 3000");
});
