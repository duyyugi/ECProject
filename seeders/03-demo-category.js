'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let data = [
      {name: "Lập trình Web", imagePath: '/img/category/web.png'},
      {name: "Lập trình Mobile", imagePath: '/img/category/mobile.png'},
      {name: "Lập trình Nhúng", imagePath: '/img/category/nhung.jpg'},
      {name: "Lập trình desktop app", imagePath: '/img/category/desktop.jpg'},
      {name: "Khóa học database", imagePath: '/img/category/database.png'}
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
      return queryInterface.bulkInsert('Categories',data,{});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Categories", null, {});
  }
};
