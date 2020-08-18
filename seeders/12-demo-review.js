'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let data = [
      {rate: "5", comment: "Khóa học tuyệt vời", courseID:"1", userID:"1"},
      {rate: "4", comment: "Khóa học hay", courseID:"1", userID:"2"},
      {rate: "3", comment: "Khóa học khá hay", courseID:"2", userID:"3"}
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
      return queryInterface.bulkInsert('Reviews',data,{});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Reviews", null, {});
  }
};
