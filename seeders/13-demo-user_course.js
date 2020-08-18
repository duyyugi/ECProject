'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let data = [
      {courseID: "1", userID:"3"},
      {courseID: "2", userID:"3"},
      {courseID: "3", userID:"4"},
      {courseID: "4", userID:"4"},
      {courseID: "5", userID:"4"},
      {courseID: "6", userID:"4"},
      {courseID: "7", userID:"5"},
      {courseID: "8", userID:"5"},
      {courseID: "9", userID:"5"},
      {courseID: "10", userID:"5"},
      {courseID: "11", userID:"6"},
      {courseID: "12", userID:"6"},
      {courseID: "13", userID:"6"},
      {courseID: "14", userID:"6"},
      {courseID: "15", userID:"7"},
      {courseID: "16", userID:"7"},
      {courseID: "17", userID:"7"},

    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
      return queryInterface.bulkInsert('User_Courses',data,{});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("User_Courses", null, {});
  }
};
