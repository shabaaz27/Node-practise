const fs = require('fs')
const express = require('express')

const app = express()

app.use(express.json()) //middleware

// app.get('/',(req,res)=>{
//     res.status(200).json({message:"Hello from server",app:"Natorus"})
// })

// app.post('/',(req,res)=>{
//     res.status(200
//         ).send('You can post ')
// })


const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))
app.get('/api/v1/tours',(req,res)=>{

res.status(200).json({
    status:'success',
    code:200,
    results:tours.length,
    data:{
        tours
    }
})

})

app.get('/api/v1/tours/:id',(req,res)=>{
    console.log(req.params.id)
    const id = req.params.id*1

const tour = tours.find(item=> item.id === id)

if(!tour){
    res.status(404).json({
        status:'failed',
        code:404,
        message:"Invalid Id"
    })
}else{
    res.status(200).json({
        status:'success',
        code:200,
        data: tour       
    })}
    })


app.post('/api/v1/tours',(req,res)=>{
    // console.log(req.body)
    const newId = tours[tours.length-1].id+1
    const newTour = Object.assign({id:newId},req.body)
    tours.push(newTour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err=>{
        res.status(201).json({
           status:"success",
            code:201,
            data:{tour:newTour}
        })
    })
})






const port = 4000
app.listen(port,()=>{
    console.log('Listening port ',{port})
})