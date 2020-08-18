'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let data = [
      {
        priceDiscount: 0.3,
        startAt:"5/6/2020",
        endAt: "9/6/2020",
        code:"ABCXYZ",
      },
      {
        priceDiscount: 0.5,
        startAt:"5/20/2020",
        endAt: "5/21/2020",
        code:"WELXYZ",
      },
      {
        priceDiscount: 0.1,
        startAt:"5/4/2020",
        endAt: "5/29/2020",
        code:"HOME",
      },
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
      return queryInterface.bulkInsert('Vouchers',data,{});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Vouchers", null, {});
  }
};
