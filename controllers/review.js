const {reviewSchema} = require("../schema.js");
const Review = require("../modules/review.js");
const Listening = require('../modules/Listening.js');

module.exports.create = async(req , res)=>{
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

}

module.exports.destroy = async (req , res)=>{
  let {id , reviewId}= req.params;
  await Listening.findByIdAndUpdate(id , {$pull : {review: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("sucess" , "Review Deleted  Sucessfully");
  res.redirect(`/listing/${id}`)
}