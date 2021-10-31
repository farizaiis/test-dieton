'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('listExercises', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      exerciseId: {
        type: Sequelize.INTEGER,
        references: {
          model : "exercises",
          key : "id"
        },
        onUpdate : "CASCADE",
        onDelete : "CASCADE"
      },
      exercisesPlanId: {
        type: Sequelize.INTEGER,
        references: {
          model : "exercisesPlans",
          key : "id"
        },
        onUpdate : "CASCADE",
        onDelete : "CASCADE"
      },
      long: {
        type: Sequelize.STRING
      },
      time : {
        type: Sequelize.ENUM('Hours', 'Minutes')
      },
      calAmount: {
        type: Sequelize.INTEGER
      },
      alert: {
        type: Sequelize.TIME
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    await queryInterface.dropTable('listExercises');
  }
};