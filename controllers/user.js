const User = require("../modules/user.js");

module.exports.create = (req , res)=>{
    res.render("users/signup.ejs");

}

module.exports.createsave = async(req , res, next)=>{
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
    
}

module.exports.login = (req , res)=>{
    res.render("users/login.ejs");
}

module.exports.savelogin = async (req , res)=>{
    req.flash("sucess", "Welcomeback to wonderlust");
    let redirectUrl = res.locals.redirectUrl || "/alllist"; 
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("sucess" , "you are logout");
        res.redirect("/alllist")
    })
}