'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    rate: DataTypes.SMALLINT,
    comment: DataTypes.TEXT,
  }, {});
  Review.removeAttribute('id')
  Review.associate = function(models) {
    Review.belongsTo(models.User,{foreignKey:'userID'});
    Review.belongsTo(models.Course,{foreignKey:'courseID'});
  };
  return Review;
};