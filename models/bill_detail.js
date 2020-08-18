'use strict';
module.exports = (sequelize, DataTypes) => {
    const Bill_Detail = sequelize.define('Bill_Detail', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        price: DataTypes.INTEGER
    }, {});
    Bill_Detail.associate = function(models) {
        Bill_Detail.belongsTo(models.Bill, { foreignKey: 'billID' });
        Bill_Detail.belongsTo(models.Course, { foreignKey: 'courseID' });
    };
    return Bill_Detail;
};