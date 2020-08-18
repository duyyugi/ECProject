'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_Voucher = sequelize.define('User_Voucher', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement: true,
    },
    canUse:{
      type: DataTypes.BOOLEAN
    }
  }, {});
  User_Voucher.associate = function(models) {
    User_Voucher.belongsTo(models.Voucher,{foreignKey:'voucherID'});
    User_Voucher.belongsTo(models.User,{foreignKey:'userID'});
  };
  return User_Voucher;
};