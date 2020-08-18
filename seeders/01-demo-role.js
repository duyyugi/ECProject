'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let data = [
      {role: "student"},
      {role: "teacher"},
      {role: "manager"},
      {role: "staffCare"},
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
      return queryInterface.bulkInsert('Roles',data,{});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Roles", null, {});
  }
};
