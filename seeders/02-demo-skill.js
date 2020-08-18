'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let data = [
      {skillName: "nodejs"},
      {skillName: "php"},
      {skillName: "java"},
      {skillName: "javascript"},
      {skillName: "c"},
      {skillName: "c++"},
      {skillName: "c#"},
      {skillName: "fontend"},
      {skillName: "backend"},
      {skillName: "mysql"},
      {skillName: "sqlServer"},
      {skillName: "oracle"},
      {skillName: "embedded"},
      {skillName: "react Native"},
      {skillName: "android"},
      {skillName: "IOS"},
      {skillName: "Python"},
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
      return queryInterface.bulkInsert('Skills',data,{});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Skills", null, {});
  }
};
