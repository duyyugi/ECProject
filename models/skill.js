'use strict';
module.exports = (sequelize, DataTypes) => {
    const Skill = sequelize.define('Skill', {
        skillID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        skillName: DataTypes.STRING
    }, {});
    Skill.associate = function(models) {
        Skill.hasMany(models.User_Skill, { foreignKey: 'skillID' });
        Skill.hasMany(models.Course, { foreignKey: 'skillID' });
    };
    return Skill;
};