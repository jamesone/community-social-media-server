var configModels    = require('../../config').models;

module.exports = function(sequelize, DataTypes) {

  var locations = sequelize.define(configModels.locations, {
    locationId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    associate: function(models) {
          // location.hasMany(models.post, {
          //   foreignKey: { 
          //     allowNull: true, 
          //     name: 'typeId'
          //   }
          // });
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return locations;
}