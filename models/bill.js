'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bill = sequelize.define('Bill', {
    billID: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement: true,
    },
    revenue: DataTypes.INTEGER,
    paymentMethod: DataTypes.STRING,
    dateCreated: DataTypes.DATE
  }, {});
  Bill.associate = function(models) {
    Bill.belongsTo(models.User, {foreignKey:'userID'});
    Bill.belongsTo(models.Voucher,{foreignKey:'voucherID'});
    Bill.hasOne(models.Bill_Detail,{foreignKey:'billID'});
  };
  return Bill;
};