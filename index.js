const express = require('express');
const mongoose = require('mongoose');
const app = express();
const List = require("./modules/Listening.js");
const path = require("path");
const Listening = require('./modules/Listening.js');
const methodOverride = require("method-override");
const ejsmate= require("ejs-mate")


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
app.use(express.urlencoded ({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "/public")))

// Root Route
app.get("/", (req , res)=>{
  res.send("Welcome to the home page")
})

// Index Route
app.get("/alllist", async(req , res)=>{
   let alldata = await List.find({});
   res.render("listening/index.ejs" , {alldata})

})

// Create Route
app.get("/listing/new" , (req , res)=>{
  res.render("listening/create.ejs")

})

app.post("/listening/response", async (req , res)=>{
  console.log(req.body.listing)
  const listening = new Listening(req.body.listing);
  await listening.save();
  res.redirect("/alllist")

})

// Read Route
app.get("/listing/:id", async (req , res)=>{
  let {id}= req.params;
  let show = await List.findById(id);
  res.render("listening/show.ejs", {show})
})

// Update Route
app.get("/listings/:id/edit", async (req ,res)=>{
  let {id}= req.params;
  let show = await List.findById(id);
  res.render("listening/Edit.ejs" , {show});

})

app.put("/listing/:id", async(req , res)=>{
  let {id} = req.params;
  await Listening.findByIdAndUpdate(id , {...req.body.listing});
  res.redirect(`/listining/${id}`)

})

// Delete Route
app.delete("/listing/:id", async(req , res)=>{
  let {id} = req.params;
  let deletedList = await Listening.findByIdAndDelete(id);
  console.log(deletedList); 
  res.redirect("/alllist")

})
