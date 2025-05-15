const express = require('express');
const mongoose = require('mongoose');
const app = express();
const List = require("./modules/Listening.js");
const path = require("path");


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
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded ({extended : true}))

// Index Route
app.get("/alllist", async(req , res)=>{
   let alldata = await List.find({});
   res.render("listening/index.ejs" , {alldata})

})

// Read Route
app.get("/listing/:id", async (req , res)=>{
  let {id}= req.params;
  let show = await List.findById(id);
  res.render("listening/show.ejs", {show})
})