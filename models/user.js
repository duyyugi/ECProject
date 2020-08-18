'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userID: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement: true,
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.TEXT,
    description: DataTypes.TEXT,
    phone: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    banned: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    User.hasMany(models.User_Skill,{foreignKey:'userID'});
    User.belongsTo(models.Role,{foreignKey:'roleID'});
    User.hasMany(models.Bill,{foreignKey:'userID'});
    User.hasMany(models.Review,{foreignKey:'userID'});
    User.hasMany(models.User_Course,{foreignKey:'userID'});
    User.hasMany(models.Course,{foreignKey:'userID'});
  };
  return User;
};