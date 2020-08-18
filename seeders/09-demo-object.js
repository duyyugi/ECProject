'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let data = [
      {name: "Nhập môn"},
      {name: "Kiến thức căn bản"}
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
      return queryInterface.bulkInsert('Objects',data,{});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Objects", null, {});
  }
};
