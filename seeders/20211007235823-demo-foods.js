'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('foods', [
        {
            name: 'Banana',
            calorie: 105,
            unit: 'Slice',
            createdAt : new Date(),
            updatedAt : new Date()
        },
        {
          name: 'Bread',
          calorie: 32,
          unit: 'Slice',
          createdAt : new Date(),
          updatedAt : new Date()
        },
        {
          name: 'Apple',
          calorie: 52,
          unit: 'Piece',
          createdAt : new Date(),
          updatedAt : new Date()
        },
        {
          name: 'Milk',
          calorie: 42,
          unit: 'Glass',
          createdAt : new Date(),
          updatedAt : new Date()
        },
      ])

  },
  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('foods', null, {});
  }
};
