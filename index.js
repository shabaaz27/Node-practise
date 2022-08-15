const express = require('express')

const app = express()

app.get('/',(req,res)=>{
    res.status(200).json({message:"Hello from server",app:"Natorus"})
})

app.post('/',(req,res)=>{
    res.status(200
        ).send('You can post ')
})
const port = 4000
app.listen(port,()=>{
    console.log('Listening port ',{port})
})