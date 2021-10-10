'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mealsPlans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      mealsTime: {
        type: Sequelize.ENUM('Breafast', 'Lunch', 'Dinner', 'Snack')
      },
      date: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM(0, 1),
        defaultValue : 0
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('mealsPlans');
  }
};