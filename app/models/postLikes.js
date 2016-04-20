var configModels    = require('../../config').models;
  
module.exports = function(sequelize, DataTypes) {
  var postLikes = sequelize.define(configModels.postLikes, {
    userId: {
      type: DataTypes.INTEGER,
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
          //  postLikes.belongsTo(models.post, {
          //   foreignKey: { 
          //     allowNull: false,
          //     name: 'postId',
          //   }
          // });
        }
    }, 
    freezeTableName: true 
  });
  
  return postLikes;
}