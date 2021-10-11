'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class calorieTracker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  calorieTracker.init({
    userId: DataTypes.INTEGER,
    calorieSize: DataTypes.INTEGER,
    calConsumed: DataTypes.INTEGER,
    remainCalSize: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'calorieTracker',
  });
  return calorieTracker;
};