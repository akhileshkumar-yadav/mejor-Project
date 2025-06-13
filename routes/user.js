const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.signupForm)
.post( wrapAsync(userController.signup));
// signup form open
// router.get("/signup",userController.signupForm);
// signup form submit
// router.post("/signup", wrapAsync(userController.signup));
// login form open

router.route("/login")
.get(userController.loginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);
// router.get("/login",userController.loginForm);
// login form submit
// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );
// logout route
router.get("/logout", userController.logout);

module.exports = router;
