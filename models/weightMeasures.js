'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class weightMeasures extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    weightMeasures.init({
        userId: DataTypes.INTEGER,
        weight: DataTypes.INTEGER,
        height: DataTypes.INTEGER,
        waistline: DataTypes.INTEGER,
        thigh: DataTypes.INTEGER,
        date: DataTypes.DATEONLY
    }, {
        sequelize,
        modelName: 'weightMeasures',
    });
    return weightMeasures;
};