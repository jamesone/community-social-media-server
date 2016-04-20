var configModels    = require('../../config').models;

module.exports = function(sequelize, DataTypes) {

  var post = sequelize.define(configModels.post, {
    postId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // city: {
    //   type: DataTypes.INTE,
    //   allowNull: false
    // },
    location_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    longitude: {
      type: DataTypes.FLOAT(53),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT(53),
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // distance: {
    //   type: DataTypes.VIRTUAL,
    //   get: function () {
    //     const longitude = this.getDataValue('longitude'); // Prints out the right value
    //     const latitude= this.getDataValue('latitude'); // Prints out the right value

    //     const a = Math.cos( longitude /*.toRad()*/ );
    //     const b = Math.cos ( this.latitude /*.toRad()*/ );
    //     const c = Math.cos ( this.longitude /*.toRad()*/ - longitude  /*.toRad()*/);
    //     const d = Math.sin( latitude /*.toRad()*/);
    //     const e = Math.sin( this.latitude /*.toRad()*/ ); 
    //     const x = 6371 * Math.acos(Math.cos(
    //         a * b  * c + d * e
    //       )
    //     );

    //     console.log(this.getDataValue('longitude'));
    //     return x;

    //    },
    // }
  }, {
    classMethods: {
        associate: function(models) {
          console.log(models);
          post.hasMany(models.comment, {
            foreignKey: { 
              allowNull: true, 
              name: 'postId'
            }
          });
          post.belongsTo(models.postType, {
            foreignKey: { 
              allowNull: true, 
              name: 'typeId'
            }
          });
          post.belongsTo(models.user, {
            foreignKey: { 
              allowNull: true, 
              name: 'userId'
            }
          });
          post.belongsTo(models.locations, {
            foreignKey:  {
              allowNull: true,
              name: 'city',
            }
          });
          post.hasMany(models.postLikes, {
            foreignKey: {
              allowNull: false,
              name: 'postId',
            }
          });
        }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return post;
}

if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}