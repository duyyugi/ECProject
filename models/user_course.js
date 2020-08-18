'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_Course = sequelize.define('User_Course', {
  }, {});
  User_Course.associate = function(models) {
    User_Course.belongsTo(models.User,{foreignKey:'userID'});
    User_Course.belongsTo(models.User,{foreignKey:'courseID'});
  };
  return User_Course;
};