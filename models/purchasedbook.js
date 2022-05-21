"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class purchasedBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      purchasedBook.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });
      purchasedBook.belongsTo(models.book, {
        as: "book",
        foreignKey: {
          name: "idBook",
        },
      });
    }
  }
  purchasedBook.init(
    {
      idUser: DataTypes.INTEGER,
      idBook: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "purchasedBook",
    }
  );
  return purchasedBook;
};
