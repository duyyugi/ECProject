'use strict';
module.exports = (sequelize, DataTypes) => {
  const Object = sequelize.define('Object', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.TEXT
  }, {});
  Object.associate = function (models) {
    Object.hasMany(models.Course,{foreignKey:'objectId'});
  };
  return Object;
};