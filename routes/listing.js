const express = require("express");
const router = express.Router();
const List = require("../modules/Listening.js");
const Listening = require('../modules/Listening.js');
const methodOverride = require("method-override");
const ejsmate= require("ejs-mate");
const WrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require('../utils/wrapAsync.js');
const {Listingschema} = require("../schema.js");
const passport = require("passport");
const flash = require("connect-flash");
const {isLogedin} = require("../middleware/auth.js")
const {isOwner} = require("../middleware/auth.js")

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
router.get("/listing/new" ,isLogedin,  async(req , res)=>{
  res.render("listening/create.ejs");
})

router.post("/listening/response",isLogedin, validate, WrapAsync  (async (req , res , next)=>{
  const listening = new Listening(req.body.listing);
  listening.owner = req.user._id;
  await listening.save();
  req.flash("sucess" , "New Listing Created");
  res.redirect("/alllist");

}))

// Read Route
router.get("/listing/:id", WrapAsync(async (req , res)=>{
  let {id}= req.params;
  let show = await List.findById(id)
    .populate({
      path: 'review',
      populate: {
        path: 'author'
      }
    })
    .populate('owner');
  if(!show){
    req.flash("error" , "Listing not Found");
    res.redirect("/alllist");
  }
  res.render("listening/show.ejs", {show})
}))

// Update Route
router.get("/listings/:id/edit", isLogedin,  wrapAsync(async (req ,res)=>{
  let {id}= req.params;
  let show = await List.findById(id);
  res.render("listening/Edit.ejs" , {show});

}))

router.put("/listing/:id",isLogedin,isOwner,  validate,  wrapAsync(async(req , res)=>{
  let {id} = req.params;
  await Listening.findByIdAndUpdate(id , {...req.body.listing});
   res.redirect(`/listing/${id}`);

}))

// Delete Route
router.delete("/listing/:id",isLogedin, isOwner , wrapAsync(async(req , res)=>{
  let {id} = req.params;
  let deletedList = await Listening.findByIdAndDelete(id);
  req.flash("sucess" , "Listing Deleted");
  res.redirect("/alllist")

}))

module.exports = router