const express  = require('express')
const path = require('path')
const app = express();

app.use(express.json());

app.get('/pc',(req,res)=>{
    
    res.sendFile('index.html',{root: __dirname });
})

app.get('/files/:filename',(req,res)=>{
    const filePath = path.join(__dirname,'/files/')
    console.log(filePath)
    res.sendFile(req.params.filename,{root:filePath});
})


// app.use(function (err,req,res,next){
//     res.status(500).json({
//         msg: "Error somewhere!"
//     })
// })

app.listen(3000);
