'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      profilePic: {
        type: Sequelize.STRING,
        defaultValue: "https://res.cloudinary.com/dejongos/image/upload/v1634276426/profilePic/default.png"
      },
      cover: {
        type: Sequelize.STRING,
        defaultValue: "https://res.cloudinary.com/dejongos/image/upload/v1635134209/cover/defaultCover_pzsimp.png"
      },
      height: {
        type: Sequelize.INTEGER
      },
      progress: {
        type: Sequelize.INTEGER
      },
      earlyWeight: {
        type: Sequelize.INTEGER
      },
      BMI: {
        type: Sequelize.INTEGER
      },
      calorieSize: {
        type: Sequelize.INTEGER
      },
      role: {
        type: Sequelize.ENUM('admin', 'user'),
        defaultValue: 'user'
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('users');
  }
};
