'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class listExercises extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      listExercises.belongsTo(models.exercisesPlans, {foreignKey: 'exercisesPlanId'})
      listExercises.belongsTo(models.exercises, {foreignKey: 'exerciseId'})
    }
  };
  listExercises.init({
    exerciseId: DataTypes.INTEGER,
    exercisesPlanId: DataTypes.INTEGER,
    long: DataTypes.STRING,
    time: DataTypes.STRING,
    calAmount: DataTypes.INTEGER,
    alert: DataTypes.TIME,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'listExercises',
  });
  return listExercises;
};