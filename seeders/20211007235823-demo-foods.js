'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('foods', [
        {
            name: 'Banana',
            calorie: 105,
            unit: 'Slice',
            rda : 5,
            createdAt : new Date(),
            updatedAt : new Date()
        },
        {
          name: 'Bread',
          calorie: 32,
          unit: 'Slice',
          rda : 2,
          createdAt : new Date(),
          updatedAt : new Date()
        },
        {
          name: 'Apple',
          calorie: 52,
          unit: 'Piece',
          rda : 3,
          createdAt : new Date(),
          updatedAt : new Date()
        },
        {
          name: 'Milk',
          calorie: 42,
          unit: 'Glass',
          rda : 2,
          createdAt : new Date(),
          updatedAt : new Date()
        },
        {
          name: 'Strawberry Jam',
          calorie: 42,
          unit: 'Spoon',
          rda: 2,
          createdAt : new Date(),
          updatedAt : new Date()
        }
      ])

  },
  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('foods', null, {});
  }
};
