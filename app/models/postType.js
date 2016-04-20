var configModels    = require('../../config').models;

module.exports = function(sequelize, DataTypes) {

  var postType = sequelize.define(configModels.postType, {
    typeId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    // associate: function(models) {
    //       // postType.hasMany(models.post, {
    //       //   foreignKey: { 
    //       //     allowNull: true, 
    //       //     name: 'typeId'
    //       //   }
    //       // });
    // },
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return postType;
}