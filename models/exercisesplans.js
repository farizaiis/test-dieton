'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class exercisesPlans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      exercisesPlans.belongsTo(models.users, {foreignKey: 'userId'})
      exercisesPlans.belongsTo(models.exercises, {foreignKey: 'exerciseId'})
    }
  };
  exercisesPlans.init({
    exerciseId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    long: DataTypes.STRING,
    time: DataTypes.STRING,
    calAmount: DataTypes.INTEGER,
    alert: DataTypes.TIME,
    date: DataTypes.DATEONLY,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'exercisesPlans',
  });
  return exercisesPlans;
};