var passport = require("passport");
var User = require("../models/user")

var LocalStrategy = require("passport-local").Strategy;

passport.use("login", new LocalStrategy(function (username, password, done) {
	(async () => {
		let user = await User.findOne({
			where: {
				username: username
			}
		}).catch((error) => {
			done(error);
		});

		if (!user) {
			return done(null, false, { message: "No user has that username!" });
		}

		user.checkPassword(password, function (err, isMatch) {
			if (err) { return done(err); }
			if (isMatch) {
				return done(null, user);
			} else {
				return done(null, false, { message: "Invalid password." });
			}
		});
	})();

}));

module.exports = function() {
	passport.serializeUser(function(user, done) {
		done(null, user.username);
	});
	passport.deserializeUser(function(id, done) {
		(async () => {
			let user = await User.findById(id)
			.catch((error) => {
				done(error);
			});
			done(null, user);
		})();
	});
}

