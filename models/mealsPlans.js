'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mealsPlans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      mealsPlans.belongsToMany(models.foods,
        {
          through: models.listMeals,
          as : "foods"
        })
      // mealsPlans.belongsTo(models.users, {foreignKey: 'userId'})
    }
  };
  mealsPlans.init({
    userId: DataTypes.INTEGER,
    mealsTime: DataTypes.STRING,
    totalCalAmount: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'mealsPlans',
  });
  return mealsPlans;
};