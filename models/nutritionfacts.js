'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class nutritionFacts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  nutritionFacts.init({
    poster: DataTypes.STRING,
    title: DataTypes.STRING,
    creator: DataTypes.STRING,
    releaseDate: DataTypes.DATEONLY,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'nutritionFacts',
  });
  return nutritionFacts;
};