'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('foods', [
      {
        name: 'Pilates',
        calorie: 256,
        logoExercise: 'https://res.cloudinary.com/dejongos/image/upload/v1635030664/logoExercise/pilates_z0seqr.png',
        createdAt : new Date(),
        updatedAt : new Date()
      },
      {
        name: 'Yoga',
        calorie: 233,
        logoExercise: 'https://res.cloudinary.com/dejongos/image/upload/v1635030664/logoExercise/yoga_dva1b6.png',
        createdAt : new Date(),
        updatedAt : new Date()
      },
      {
        name: 'Cycling',
        calorie: 284,
        logoExercise: 'https://res.cloudinary.com/dejongos/image/upload/v1635030664/logoExercise/cycling_qxrsfu.png',
        createdAt : new Date(),
        updatedAt : new Date()
      },
      {
        name: 'Basket',
        calorie: 250,
        logo: 'https://res.cloudinary.com/dejongos/image/upload/v1635030664/logoExercise/basket_vzyjfq.png',
        createdAt : new Date(),
        updatedAt : new Date()
      },
      {
        name: 'Running',
        calorie: 250,
        logoExercise: 'https://res.cloudinary.com/dejongos/image/upload/v1635030664/logoExercise/running_zewulw.png',
        createdAt : new Date(),
        updatedAt : new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
