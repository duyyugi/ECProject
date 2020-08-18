'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      phone: {
        type: Sequelize.STRING
      },
      joiningDate: {
        type: Sequelize.DATE
      },
      dateOfBirth: {
        type: Sequelize.DATE
      },
      isAdmin: {
        type: Sequelize.BOOLEAN
      },
      isTeacher: {
        type: Sequelize.BOOLEAN
      },
      isStaffCare: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};