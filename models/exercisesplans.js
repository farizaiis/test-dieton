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
      exercisesPlans.belongsToMany(models.exercises,
        {
          through: models.listExercises,
          as : "listexercises"
        })
        
      exercisesPlans.belongsTo(models.users, {as : 'exerciseplans', foreignKey: 'userId'})
    }
  };
  exercisesPlans.init({
    userId: DataTypes.INTEGER,
    totalCalAmount: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'exercisesPlans',
  });
  return exercisesPlans;
};