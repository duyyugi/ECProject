'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let data = [
      {
        voucherID: 1,
        userID: 1,
        canUse: true
      },
      {
        voucherID: 1,
        userID: 2,
        canUse: true
      },
      {
        voucherID: 1,
        userID: 3,
        canUse: true
      },
      {
        voucherID: 1,
        userID: 4,
        canUse: false
      },
      {
        voucherID: 1,
        userID: 5,
        canUse: true
      },
      {
        voucherID: 2,
        userID: 1,
        canUse: false
      },
      {
        voucherID: 2,
        userID: 2,
        canUse: true
      },
      {
        voucherID: 2,
        userID: 3,
        canUse: false
      },
      {
        voucherID: 2,
        userID: 4,
        canUse: false
      },
      {
        voucherID: 2,
        userID: 5,
        canUse: false
      },
      {
        voucherID: 2,
        userID: 6,
        canUse: false
      },
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
    return queryInterface.bulkInsert('User_Vouchers', data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("User_Vouchers", null, {});
  }
};
