const Sequelize = require("sequelize")

const db = new Sequelize(
	'express',	// 数据库名
	'root',		// 账户名
	'123456',	// 密码
	{
		'dialect': 'mysql',
		'host': 'localhost',
		'port': 3306,
	}
)

module.exports = db;