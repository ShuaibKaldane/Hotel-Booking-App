const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const expressSession = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modules/user.js");

// Import Routers
const ListingsRouter = require("./routes/listing.js");
const ReviewRouter = require("./routes/review.js");
const UserRouter = require("./routes/user.js");
const BookingRouter = require("./routes/booking.js");

const port = 8080;

main().catch(err => console.log(err));

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

// Passport JS implementation
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req , res , next)=>{
  res.locals.sucess = req.flash("sucess");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// Routers Defined
app.use("/", ListingsRouter);
app.use("/listing" , ReviewRouter);
app.use("/", UserRouter);
app.use("/", BookingRouter);


app.use( (req, res, next)=>{
  next(new ExpressError("Page not found" , 404))
})

// 404 Error
app.use((err , req, res, next)=>{
  let {message = "Something went wrong" , status = 500} = err;
  res.render("Error.ejs", {err})
})

app.listen(port, ()=>{
  console.log(`Server is listening on port ${port}`);
})