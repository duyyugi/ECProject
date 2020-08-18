'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    roleID: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement: true,
    },
    role: DataTypes.STRING
  }, {});
  Role.associate = function(models) {
    Role.hasMany(models.User,{foreignKey: 'roleID'});
  };
  return Role;
};