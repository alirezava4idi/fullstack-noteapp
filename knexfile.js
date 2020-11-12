// Update with your config settings.
require("dotenv").config()
module.exports = {
	development: {
		client: "mysql",
		connection: {
			host: process.env.DBHOST,
			user: process.env.DBUSER,
			password: process.env.DBPASS,
			database: process.env.DBNAME,
		},
		migrations: {
			directory: "./db/migrations",
		},
	},
};