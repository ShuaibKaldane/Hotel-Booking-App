const Listening = require("../modules/Listening.js");

module.exports.isLogedin = (req , res , next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in ");
        return res.redirect("/login");
    }

    return next();
}

module.exports.saveRedirectUrl = (req , res , next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req , res , next)=>{
    let {id} = req.params;
  let listing = await Listening.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "You do the owner of this listings");
    return res.redirect(`/listing/${id}`);
  }
  next();
}