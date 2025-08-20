const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware/auth.js");
const {create} = require("../controllers/user.js");
const {createsave} = require("../controllers/user.js");
const {login} = require("../controllers/user.js");
const {savelogin} = require("../controllers/user.js");
const {logout} = require("../controllers/user.js");

// Optimize way of writing route
router.route("/signup")
.get(create)
.post(wrapAsync(createsave));

router.route("/login")
.get(login)

router.route("/login")
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect : "/login" , failureFlash : true}), savelogin);

router.get("/logout", logout)
module.exports = router;