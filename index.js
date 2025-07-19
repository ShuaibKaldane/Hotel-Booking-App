const express = require('express');
const mongoose = require('mongoose');
const app = express();
const List = require("./modules/Listening.js");
const path = require("path");
const Listening = require('./modules/Listening.js');
const methodOverride = require("method-override");
const ejsmate= require("ejs-mate");
const WrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require('./utils/wrapAsync.js');
const {Listingschema} = require("./schema.js")
const Review = require("./modules/review.js")
const {reviewSchema} = require("./schema.js")

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

// Server Side Validation for Reviews
const validateReview = (req , res , next)=>{
  console.log("Review validation - req.body:", req.body);
  
  // Convert rating to number if it exists
  if (req.body.review && req.body.review.rating) {
    req.body.review.rating = Number(req.body.review.rating);
    console.log("Converted rating to:", req.body.review.rating);
  }
  
  let {error}= reviewSchema.validate(req.body);
  if(error){
    console.log("Validation error:", error.details);
    let message = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(message, 400)
  }else{
    console.log("Validation passed");
    next()
  }
}
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
app.get("/listing/new" , async(req , res)=>{
  res.render("listening/create.ejs")

})

app.post("/listening/response", validate, WrapAsync  (async (req , res , next)=>{
  const listening = new Listening(req.body.listing);
  await listening.save();
  res.redirect("/alllist")

}))

// Read Route
app.get("/listing/:id", WrapAsync(async (req , res)=>{
  let {id}= req.params;
  let show = await List.findById(id).populate('review');
  res.render("listening/show.ejs", {show})
}))

// Update Route
app.get("/listings/:id/edit", wrapAsync(async (req ,res)=>{
  let {id}= req.params;
  let show = await List.findById(id);
  res.render("listening/Edit.ejs" , {show});

}))

app.put("/listing/:id", validate, wrapAsync(async(req , res)=>{
  let {id} = req.params;
  await Listening.findByIdAndUpdate(id , {...req.body.listing});
   res.redirect(`/listing/${id}`);

}))

// Delete Route
app.delete("/listing/:id", wrapAsync(async(req , res)=>{
  let {id} = req.params;
  let deletedList = await Listening.findByIdAndDelete(id);
  console.log(deletedList); 
  res.redirect("/alllist")

}))

// Review Route
// Post
app.post("/listing/:id/reviews",validateReview , wrapAsync(async(req , res)=>{
  let listing = await Listening.findById(req.params.id);
  let newReview = new Review(req.body.review);
  await newReview.save();
  listing.review.push(newReview._id);
  await listing.save();
  console.log("New Review Saved");
  console.log(req.body)
  res.redirect(`/listing/${req.params.id}`);

}))

//Delete Request
app.delete("/listing/:id/reviews/:reviewId" , wrapAsync(async (req , res)=>{
  let {id , reviewId}= req.params;
  await Listening.findByIdAndUpdate(id , {$pull : {review: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listing/${id}`)
}))

app.use( (req, res, next)=>{
  next(new ExpressError("Page not found" , 404))
})

// 404 Error
app.use((err , req, res, next)=>{
  let {message = "Something went wrong" , status = 500} = err;
  res.render("Error.ejs", {err})
})