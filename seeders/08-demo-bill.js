'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        let data = [
            { revenue: "1000000", paymentMethod: "vnpay",dateCreated:"08/28/2018", userID: "1", voucherID: "1" },
            { revenue: "2000000", paymentMethod: "vnpay",dateCreated:"08/28/2018", userID: "1", voucherID: "1" },
            { revenue: "3000000", paymentMethod: "vnpay",dateCreated:"08/28/2019", userID: "1", voucherID: "1" },
            { revenue: "4000000", paymentMethod: "vnpay",dateCreated:"08/28/2019", userID: "1", voucherID: "1" },
        ];
        data.map(item => {
            item.createdAt = Sequelize.literal('NOW()');
            item.updatedAt = Sequelize.literal('NOW()');
            return item;
        });
        return queryInterface.bulkInsert('Bills', data, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Bills", null, {});
    }
};