'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('exercisesPlans', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            exerciseId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'exercises',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            long: {
                type: Sequelize.INTEGER,
            },
            time: {
                type: Sequelize.ENUM('Hours', 'Minutes'),
            },
            calAmount: {
                type: Sequelize.INTEGER,
            },
            alert: {
                type: Sequelize.TIME,
            },
            date: {
                type: Sequelize.DATEONLY,
            },
            status: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
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
        await queryInterface.dropTable('exercisesPlans');
    },
};
