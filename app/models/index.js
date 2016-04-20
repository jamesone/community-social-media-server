var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require('../../config');

var sequelize = new Sequelize(config.aws.dbName, config.aws.user, config.aws.password,  {
  dialect: 'mysql',
  host: config.aws.host,
  post: 3306
});

var db        = {};
var ignoreModel = "stories.js"; // Change to model working on

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js" )  &&  (file !== "entity.js" ) && (file !== "entityLikes.js" ) && (file !== ".DS_Store" );
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;