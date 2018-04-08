var express = require('express');
var router = express.Router();
var User = require("../models/user")

router.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.errors = req.flash("error");
	res.locals.infos = req.flash("info");
	next();
})

router.use('/user', require('./user'));
router.use('/login', require('./login'));
router.use('/logout', require('./logout'));
router.use('/edit', require('./edit'));

router.get('/', function(req, res, next) {
	(async () => {
		let users = await User.findAll({
			order:[['createAt', 'DESC']]
		}).catch((err) => { return next(err)});
		res.render('index', {users: users});
	})();
});

module.exports = router;
