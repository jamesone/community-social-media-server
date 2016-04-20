var configModels    = require('../../config').models;
  
module.exports = function(sequelize, DataTypes) {

  var entity = sequelize.define(configModels.entity, {
    entityId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
  }, {
    classMethods: {
        // associate: function(models) {
        //    comment.belongsTo(models.post, {
        //     foreignKey: { 
        //       allowNull: false
        //     }
        //   });
        // }
    }, 
    freezeTableName: true 
  });
  
  return entity;
}