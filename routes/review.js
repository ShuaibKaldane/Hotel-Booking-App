const express = require("express");
const router = express.Router();
const List = require("../modules/Listening.js");
const Listening = require('../modules/Listening.js');
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require('../utils/wrapAsync.js');
const {reviewSchema} = require("../schema.js");
const Review = require("../modules/review.js");
const {isLogedin} = require("../middleware/auth.js");

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

router.post("/:id/reviews",validateReview , isLogedin, wrapAsync(async(req , res)=>{
  let listing = await Listening.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  await newReview.save();
  listing.review.push(newReview._id);
  await listing.save();
  console.log("New Review Saved");
  console.log(req.body);
  req.flash("sucess" , "Review Added Sucessfully");
  res.redirect(`/listing/${req.params.id}`);

}))

//Delete Request
router.delete("/:id/reviews/:reviewId" ,isLogedin, wrapAsync(async (req , res)=>{
  let {id , reviewId}= req.params;
  await Listening.findByIdAndUpdate(id , {$pull : {review: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("sucess" , "Review Deleted  Sucessfully");
  res.redirect(`/listing/${id}`)
}))

module.exports = router;