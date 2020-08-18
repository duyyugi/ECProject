'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    lessonID: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement: true,
    },
    lessonNo: DataTypes.SMALLINT,
    urlLesson: DataTypes.TEXT,
    name: DataTypes.STRING,
    imagePath: DataTypes.TEXT
  }, {});
  Lesson.associate = function(models) {
    Lesson.belongsTo(models.Course,{foreignKey:'courseID'});
  };
  return Lesson;
};