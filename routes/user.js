const express = require("express");
const router = express.Router();
const User = require("../modules/user.js");
const flash = require("connect-flash");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req , res)=>{
    res.render("users/signup.ejs");

})
router.post("/signup", wrapAsync(async(req , res)=>{
   try{
     let {username , email, password} = req.body;
    const newuser = new User({email , username});
    const registeredUser = await User.register(newuser , password);
    req.flash("sucess", "Welcome to WonderLust");
    res.redirect("/alllist");
   }catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");
   }
    
}))

router.get("/login", (req , res)=>{
    res.render("users/login.ejs");
})

router.post("/login", passport.authenticate("local", {failureRedirect : "/login" , failureFlash : true}), async (req , res)=>{
    req.flash("sucess", "Welcomeback to wonderlust");
    res.redirect("/alllist")
});
module.exports = router;