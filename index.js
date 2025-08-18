const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsmate= require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Listings = require("./routes/listing.js")
const Review = require("./routes/review.js");
const expressSession = require("express-session");
const flash = require("connect-flash");

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
app.use(express.static(path.join(__dirname, "/public")));

const SessionOptions = {
  secret : "breakup" , resave : false, saveUninitialized : true,
  cookie : {
    expires : Date.now()+ 7 * 24*60* 60* 1000,
    maxAge : 7 * 24*60* 60* 1000,
    httpOnly : true
  }
}

app.use(expressSession(SessionOptions));
app.use(flash());
app.use((req , res , next)=>{
  res.locals.sucess = req.flash("sucess");
  res.locals.error = req.flash("error");
  next();
})

// Routers Defined
app.use("/", Listings)
app.use("/listing" , Review)


app.use( (req, res, next)=>{
  next(new ExpressError("Page not found" , 404))
})

// 404 Error
app.use((err , req, res, next)=>{
  let {message = "Something went wrong" , status = 500} = err;
  res.render("Error.ejs", {err})
})