const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Listening = require("./modules/Listening.js")

app.listen(8080, ()=>{
    console.log("App is listening on port 8080");
})

main().then(()=>{
    console.log("Database connected sucessfully")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

  
}

app.get("/test", async (req , res)=>{
    let sample = new Listening({
        title : "My Villa",
        description : "By the beach",
        price : 1200,
        location : "Goa Calangute",
        country: "India"

    })
    await sample.save().then(()=>{
        console.log("Data save Sucessfully")
    }).catch((error)=>{
        console.log(error)

    })
    res.send("Testing was Sucessfully")

    
})