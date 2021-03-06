var ip = require('ip');

const urls = {
	// Home url
	// home: "http://192.168.0.12:3000/api/v1/",
	home: "http://localhost:3000/api/v1/",

	ip: "http://localhost:80/api/v1/",
	// ip: "http://192.168.15.80/api/v1/",

	// For home dev
	// ip: "http://"+ip.address() + ":3000/api/v1/",
};

module.exports = {
	secret: "secretCodeOneTwo121",
	dbUser: "james",
	dbName: "bbus",
	dbPass: "root",
	host: "au-cdbr-azure-east-a.cloudapp.net",
	port: "1337",
	aws: {
		host: process.env.RDS_HOSTNAME ? process.env.RDS_HOSTNAME : 'localhost' , 
		user: process.env.RDS_USERNAME ? process.env.RDS_USERNAME : 'root',
		password : process.env.RDS_PASSWORD ? process.env.RDS_PASSWORD : 'root',
		port: process.env.RDS_PORT ? process.env.RDS_PORT : 3000,
		dbName: process.env.RDS_HOSTNAME ? 'ebdb' : 'bbus',
	},
	// Add models and reference this object everywhere
	models: {
		post: "post",
		locations: "locations",
		user: "user",
		entity: "entity",
		entityLikes: "entityLikes",
		authTokens: "authTokens",
		comment: "comment",
		postType: "postType",
		postLikes: "postLikes",
	},
	entityIds: {
		comment: 1,
		post: 2,
	},
	url: urls.ip,
	homeUrl: ""
}


