const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Kyc extends Model {
    static associate({ User }) {
      // define association here
      Kyc.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });
    }
  }

  Kyc.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      stripeId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Kyc",
      tableName: "kycs",
    }
  );
  return Kyc;
};
