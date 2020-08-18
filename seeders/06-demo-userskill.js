'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let data = [
      {
        skillID: 1,
        userID: 1
      },
      {
        skillID: 2,
        userID: 1
      },
      {
        skillID: 3,
        userID: 1
      },
      {
        skillID: 4,
        userID: 1
      },
      {
        skillID: 1,
        userID: 5
      },
      {
        skillID: 2,
        userID: 1,
      },
      {
        skillID: 2,
        userID: 5
      },
      {
        skillID: 2,
        userID: 3
      },
      {
        skillID: 1,
        userID: 4
      },
      {
        skillID: 2,
        userID: 4
      },
      {
        skillID: 3,
        userID: 4
      },
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
    return queryInterface.bulkInsert('User_Skills', data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("User_Skills", null, {});
  }
};
