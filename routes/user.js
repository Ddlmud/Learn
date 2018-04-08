var express = require('express');
var router = express.Router();

var passport = require("passport")
var User = require("../models/user")
/**
 * sign up
 */
router.get("/signup", function(req, res) {
	res.render("signup");
});

router.post("/signup", function(req, res, next) {
	let username = req.body.username;
	let password = req.body.password;

	(async () => {
		let user = await User.findOne({
			where: {
				username:username
			}
		});

		if (user) {
			req.flash("error", "User already exists.");
			return res.redirect("/user/signup");
		}

		let newUser = await User.create({
			username: username,
			password: password
		}).catch((error) => {
			req.flash("error", "Create user error.");
			return res.redirect("/user/signup");
		});
		next();
	})();
}, passport.authenticate("login", {
	successRedirect: "/",
	failureRedirect: "/user/signup",
	failureFlash: true
}));

/**
 * GET a user info
 */
router.get("/:username", function(req, res, next) {
	(async () => {
		let user = await User.findOne({
			where: {
				username: req.params.username
			}
		}).catch((error) => {
			return next(error);
		});
		if (!user) { return next(404); }
		res.render("profile", {user: user});
	})();

	// User.findOne({ username: req.params.username }, function(err, user) {
	// 	if(err) { return next(err); }
	// 	if(!user) { return next(404); }
	// 	res.render("profile", { user: user });
	// });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
