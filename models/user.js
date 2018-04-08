const db = require("../helpers/db");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt-nodejs");
const constants = require("constants");

const User = db.define('user', {
	username: { type: Sequelize.STRING(20), primaryKey:true},
	password: { type: Sequelize.STRING(64), allowNull:false},
	createAt: { type: Sequelize.DATE, defaultValue:Sequelize.NOW},
	displayName: Sequelize.STRING(20),
	bio: Sequelize.STRING
},{
	timestamps: false,
	getterMethods:
	{
		//取得昵称
		name() {
			return this.displayName || this.username;
		}
	}
});

var noop = function () { };

function HashPassword(user) {
	let saltPromise = new Sequelize.Promise(function(resolve, reject) {
		const handler = function (error, salt) {
			if (error) {
				reject(error);
			}
			resolve(salt);
		};
		bcrypt.genSalt(constants.SALT_FACTOR, handler);
	});
	return saltPromise.then(function(salt) {
		let hashPromise = new Sequelize.Promise(function(resolve, reject) {
			const handler = function (error, hashedPassword) {
				if (error) {
					reject(error);
				}
				user.password = hashedPassword;
				resolve();
			};
			bcrypt.hash(user.password, salt, noop, handler);
		});
		return hashPromise;
	});
}

// 保存操作之前的回调函数
User.hook("beforeSave", function (user, options) {
	if (user.changed("password"))
	{
		return HashPassword(user);
	}
});

// 检查密码
User.prototype.checkPassword = function (guess, done) {
	bcrypt.compare(guess, this.password, function (err, isMatch) {
		done(err, isMatch);
	});
}

// 暴露模型
module.exports = User;

