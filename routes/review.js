const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require('../utils/wrapAsync.js');
const {reviewSchema} = require("../schema.js");
const {isLogedin} = require("../middleware/auth.js");
const {create} = require("../controllers/review.js");
const {destroy} = require("../controllers/review.js");

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

router.post("/:id/reviews",validateReview , isLogedin, wrapAsync(create));

//Delete Request
router.delete("/:id/reviews/:reviewId" ,isLogedin, wrapAsync(destroy))

module.exports = router;