var configModels    = require('../../config').models;

module.exports = function(sequelize, DataTypes) {
  var token = sequelize.define(configModels.authTokens, {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // referenceces: {
      //   model: 'user',
      //   key: 'userId'
      // }
    }, 
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      // validate : {
      //   min: 64,
      //   max: 64
      // }
    },
    // #TODO add expire dates and connection to permissions
    expired: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return token;
}
// Token.sync({force: false}).then(function () {
    
// });

// module.exports = Token;