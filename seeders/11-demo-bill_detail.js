'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        let data = [
            { price: "5000000", billID: "1", courseID: "1" },
            { price: "5000000", billID: "1", courseID: "2" },
            { price: "5000000", billID: "1", courseID: "3" },
            { price: "5000000", billID: "1", courseID: "4" },
            { price: "5000000", billID: "2", courseID: "11" },
            { price: "1000000", billID: "2", courseID: "12" },
            { price: "2000000", billID: "2", courseID: "15" },
            { price: "6000000", billID: "2", courseID: "10" },
            { price: "2000000", billID: "3", courseID: "10" },
            { price: "2000000", billID: "3", courseID: "9" },
            { price: "2000000", billID: "3", courseID: "8" },
            { price: "2000000", billID: "4", courseID: "8" },
            { price: "2000000", billID: "4", courseID: "10" }
        ];
        data.map(item => {
            item.createdAt = Sequelize.literal('NOW()');
            item.updatedAt = Sequelize.literal('NOW()');
            return item;
        });
        return queryInterface.bulkInsert('Bill_Details', data, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Bill_Details", null, {});
    }
};