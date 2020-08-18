let controller = {};
let models = require('../models');
let Voucher = models.Voucher;
let User_Voucher = models.User_Voucher;

controller.checkVoucher = (code, userID) => {
    return User_Voucher.findOne({
        where: {
            userID: userID,
            canUse: true
        },
        include:[{
            model: Voucher,attributes: ['code','priceDiscount'], where: { code: code }
        }]
    })
}

controller.getVoucherByCode = (code)=>{
    return Voucher.findOne({
        where:{
            code:code
        }
    })
}
module.exports = controller;