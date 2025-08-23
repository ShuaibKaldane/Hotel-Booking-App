const express = require("express");
const router = express.Router();
const Listening = require('../modules/Listening.js'); // Remove duplicate List import
const WrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require('../utils/wrapAsync.js');
const {Listingschema} = require("../schema.js");
const {isLogedin} = require("../middleware/auth.js");
const {isOwner} = require("../middleware/auth.js");
const {index} = require("../controllers/Listening.js");
const {create} = require("../controllers/Listening.js");
const {saveCreate} = require("../controllers/Listening.js");
const {read} = require("../controllers/Listening.js");
const {update} = require("../controllers/Listening.js");
const {updatesave} = require("../controllers/Listening.js");
const {destroy} = require("../controllers/Listening.js");
const {search} = require("../controllers/Listening.js");
const {autoSuggestions} = require("../controllers/Listening.js");
const multer  = require('multer')
const {storage} = require("../CloudConfig.js");
const upload = multer({storage});

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

// Little optimize way of writting
// Index Route
router.route("/alllist")
.get(index);

// Create Route
router.route("/listing/new")
.get(isLogedin, create);

// Normal way 
router.post("/listening/response",isLogedin, validate,upload.single('listing[image]'), WrapAsync  (saveCreate));

// Read Route
router.get("/listing/:id", WrapAsync(read));

// Update Route
router.get("/listings/:id/edit", isLogedin,  wrapAsync(update));

router.put("/listing/:id",isLogedin,isOwner,  upload.single('listing[image]'), validate,  wrapAsync(updatesave));

// Delete Route
router.delete("/listing/:id",isLogedin, isOwner , wrapAsync(destroy));

// Auto-suggestions Route
router.get("/api/suggestions", wrapAsync(autoSuggestions));

// Search Route
router.get("/search", wrapAsync(search));

module.exports = router