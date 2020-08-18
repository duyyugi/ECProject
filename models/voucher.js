'use strict';
module.exports = (sequelize, DataTypes) => {
  const Voucher = sequelize.define('Voucher', {
    priceDiscount: DataTypes.NUMERIC,
    startAt: DataTypes.DATE,
    endAt: DataTypes.DATE,
    code: DataTypes.STRING
  }, {});
  Voucher.associate = function(models) {
    Voucher.hasMany(models.Bill,{foreignKey:'voucherID'});
  };
  return Voucher;
};