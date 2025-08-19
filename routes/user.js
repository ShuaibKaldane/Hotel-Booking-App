const express = require("express");
const router = express.Router();
const User = require("../modules/user.js");
const flash = require("connect-flash");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware/auth.js");

router.get("/signup", (req , res)=>{
    res.render("users/signup.ejs");

})
router.post("/signup", wrapAsync(async(req , res, next)=>{
   try{
     let {username , email, password} = req.body;
    const newuser = new User({email , username});
    const registeredUser = await User.register(newuser , password);
    req.login(registeredUser, (err)=>{
        if(err){
            return next(err)
        }
        req.flash("sucess", "Welcome to WonderLust");
        res.redirect("/alllist");
    })
   }catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");
   }
    
}))

router.get("/login", (req , res)=>{
    res.render("users/login.ejs");
})

router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect : "/login" , failureFlash : true}), async (req , res)=>{
    req.flash("sucess", "Welcomeback to wonderlust");
    let redirectUrl = res.locals.redirectUrl || "/alllist"; 
    res.redirect(redirectUrl);
});

router.get("/logout", (req, res, next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("sucess" , "you are logout");
        res.redirect("/alllist")
    })
})
module.exports = router;