'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class exercises extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      exercises.belongsToMany(models.exercisesPlans,
        {
          through: models.listExercises,
          as : "listexercises"
        })
    }
  };
  exercises.init({
    name: DataTypes.STRING,
    calorie: DataTypes.INTEGER,
    logoExercise: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'exercises',
  });
  return exercises;
};