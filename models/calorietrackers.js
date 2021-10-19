'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class calorieTrackers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      calorieTrackers.belongsTo(models.users, {foreignKey: 'userId'});
    }
  };
  calorieTrackers.init({
    userId: DataTypes.INTEGER,
    calConsumed: DataTypes.INTEGER,
    remainCalSize: DataTypes.INTEGER,
    date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'calorieTrackers',
  });
  return calorieTrackers;
};
