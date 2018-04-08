var express = require("express");
var router = express.Router();

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		req.flash("info", "You must be logged in to see this page.");
		res.redirect("/login");
	}
}

router.get("/", ensureAuthenticated, function (req, res) {
	res.render("edit");
});

router.post("/", ensureAuthenticated, function (req, res, next) {
	req.user.displayName = req.body.displayname;
	req.user.bio = req.body.bio;
	(async () => {
		await req.user.save()
		.catch((error) => 
		{
			next(error);
			return;
		});
		req.flash("info", "Profile updated!");
		res.redirect("/edit");
	})();
});

module.exports = router;