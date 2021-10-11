'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('foods', [{
            name: 'Banana',
            calorie: 105,
            unit: 'Slice',
            createdAt : new Date(),
            updatedAt : new Date()
        }])

  },
  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('foods', null, {});
  }
};
