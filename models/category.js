'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    categoryID: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    imagePath: DataTypes.TEXT
  }, {});
  Category.associate = function(models) {
    Category.hasMany(models.Course,{foreignKey:'categoryID'});
  };
  return Category;
};