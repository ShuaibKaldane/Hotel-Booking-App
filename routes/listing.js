const express = require("express");
const router = express.Router();
const List = require("../modules/Listening.js");
const Listening = require('../modules/Listening.js');
const methodOverride = require("method-override");
const ejsmate= require("ejs-mate");
const WrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require('../utils/wrapAsync.js');
const {Listingschema} = require("../schema.js")


// Server Side Validation Function
const validate = (req , res , next)=>{
  let {error}= Listingschema.validate(req.body);
  if(error){
    let message = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(message, 400)
  }else{
    next()
  }
}
router.get("/", (req , res)=>{
  res.send("Welcome to the home page")
})

// Index Route
router.get("/alllist", async(req , res)=>{
   let alldata = await List.find({});
   res.render("listening/index.ejs" , {alldata})

})

// Create Route
router.get("/listing/new" , async(req , res)=>{
  res.render("listening/create.ejs")

})

router.post("/listening/response", validate, WrapAsync  (async (req , res , next)=>{
  const listening = new Listening(req.body.listing);
  await listening.save();
  res.redirect("/alllist")

}))

// Read Route
router.get("/listing/:id", WrapAsync(async (req , res)=>{
  let {id}= req.params;
  let show = await List.findById(id).populate('review');
  res.render("listening/show.ejs", {show})
}))

// Update Route
router.get("/listings/:id/edit", wrapAsync(async (req ,res)=>{
  let {id}= req.params;
  let show = await List.findById(id);
  res.render("listening/Edit.ejs" , {show});

}))

router.put("/listing/:id", validate, wrapAsync(async(req , res)=>{
  let {id} = req.params;
  await Listening.findByIdAndUpdate(id , {...req.body.listing});
   res.redirect(`/listing/${id}`);

}))

// Delete Route
router.delete("/listing/:id", wrapAsync(async(req , res)=>{
  let {id} = req.params;
  let deletedList = await Listening.findByIdAndDelete(id);
  console.log(deletedList); 
  res.redirect("/alllist")

}))

module.exports = router