'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('users', [
      {
        fullName: 'admin',
        email: 'admin@gmail.com',
        password: '$2b$10$xWZHmnvzXePzG.5rnaKaWOc.2Rx1GPzeJkfT76AHwl73yrVQe8hH2',
        profilePic: "https://res.cloudinary.com/dejongos/image/upload/v1634276426/profilePic/default.png",
        cover: "https://res.cloudinary.com/dejongos/image/upload/v1635134209/cover/defaultCover_pzsimp.png",
        height: 175,
        progress: 0,
        earlyWeight: 86,
        BMI: 28,
        calorieSize: 1500,
        role: 'admin',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('users', null, {});
  }
};
