let controller = {};
let models = require('../models');
let Bill = models.Bill;
let Bill_Detail = models.Bill_Detail;
let Course = models.Course;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;
let db = require('../models/index');

controller.addBill = (bill) => {
    return Bill.create(bill);
};

controller.addBill_detail = (bill_detail) => {
    return Bill_Detail.create(bill_detail);
}

controller.getBillByUserID = (userID) => {
    return Bill.findAll({
        attributes: ['billID','paymentMethod'],
        where: { userID: userID },
        include: [{ model: Bill_Detail, attributes: ['price', 'createdAt', 'courseID'], include: [{ model: Course, attributes: ['name']}] }]
    })
}
module.exports = controller;