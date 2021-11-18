'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('nutritionFacts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            poster: {
                type: Sequelize.STRING,
            },
            title: {
                type: Sequelize.STRING,
            },
            creator: {
                type: Sequelize.STRING,
            },
            releaseDate: {
                type: Sequelize.DATE,
            },
            content: {
                type: Sequelize.TEXT,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('nutritionFacts');
    },
};
