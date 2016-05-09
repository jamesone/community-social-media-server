var configModels    = require('../../config').models;

module.exports = function(sequelize, DataTypes) {

  var user = sequelize.define(configModels.user, {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    }, 
    // Facebook token for sharing and etc...
    authKey: {
      type: DataTypes.STRING,
      allowNull: false,
      min: 20
    },
    fbId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    profilePic: {
      type: DataTypes.STRING,
      defaultValue: "default.jpeg"
    },
    coverPic: {
      type: DataTypes.STRING,
      defaultValue: "defaultCover.jpeg"
    }
  }, {
    classMethods: {
        associate: function(models) {
          // user.hasMany(models.photo);
        }
    }, 
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return user;
}
