'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.hasMany(models.mealsPlans, {as: 'mealsplans', foreignKey: 'userId'})
    }
  };
  users.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profilePic: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'user')
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};