var configModels    = require('../../config').models;
  
module.exports = function(sequelize, DataTypes) {
  var comment = sequelize.define(configModels.comment, {
    commentId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    // userId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   referenceces: {
    //     model: 'user',
    //     key: 'userId'
    //   }
    // }, 
    comment: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
        associate: function(models) {
           comment.belongsTo(models.user, {
            foreignKey: { 
              allowNull: false,
              name: 'userId',
            }
          });
        }
    }, 
    freezeTableName: true 
  });
  
  return comment;
}