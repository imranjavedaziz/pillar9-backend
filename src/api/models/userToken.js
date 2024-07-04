const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    static associate({ User }) {
      // define association here
      Token.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });
    }
  }

  Token.init(
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
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tokenExpires: {
        type: DataTypes.DATE,
        defaultValue: Date.now() + 43200,
      },
    },
    {
      sequelize,
      modelName: "userToken",
      tableName: "userTokens",
    }
  );
  return Token;
};
