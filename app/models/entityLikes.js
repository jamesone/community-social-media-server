var configModels    = require('../../config').models;
  
module.exports = function(sequelize, DataTypes) {
  var entityLikes = sequelize.define(configModels.entityLikes, {
    // entityId: {
    //   type: DataTypes.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: true
    // },
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      referenceces: {
        model: 'user',
        key: 'userId'
      }
    }, 
  }, {
    classMethods: {
        associate: function(models) {
          // FK entity.entityId
           entityLikes.belongsTo(models.entity, {
            foreignKey: { 
              allowNull: false,
              name: 'entityId',
            }
          });
        }
    }, 
    freezeTableName: true 
  });
  
  return entityLikes;
}