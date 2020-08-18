'use strict';
module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
        courseID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.TEXT,
        description: DataTypes.TEXT,
        price: DataTypes.DECIMAL,
        imagePath: DataTypes.TEXT,
        NoVideos: DataTypes.SMALLINT,
        priceDis: DataTypes.INTEGER,
        startedAt: DataTypes.DATE,
        endedAt: DataTypes.DATE,
        objectId: DataTypes.INTEGER,
        NumberStudent: DataTypes.INTEGER
    }, {});
    Course.associate = function(models) {
        Course.hasMany(models.User_Course, { foreignKey: 'courseID' });
        Course.hasMany(models.Review, { foreignKey: 'courseID' });
        Course.hasMany(models.Bill_Detail, { foreignKey: 'courseID' });
        Course.hasMany(models.Lesson, { foreignKey: 'courseID' });
        Course.belongsTo(models.Category, { foreignKey: 'categoryID' });
        Course.belongsTo(models.User, { foreignKey: 'userID' });
        Course.belongsTo(models.Object, { foreignKey: 'objectId' });
        Course.belongsTo(models.Skill, { foreignKey: 'skillID' });
    };
    return Course;
};