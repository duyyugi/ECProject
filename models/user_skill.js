'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_Skill = sequelize.define('User_Skill', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement: true,
    },
  }, {});
  User_Skill.associate = function(models) {
    User_Skill.belongsTo(models.Skill,{foreignKey:'skillID'});
    User_Skill.belongsTo(models.User,{foreignKey:'userID'})
  };
  return User_Skill;
};