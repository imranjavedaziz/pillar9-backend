const { Model } = require("sequelize");
const crypto = require("crypto");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(model) {
      // define association here
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("practitioner", "consumer"),
        allowNull: false,
        defaultValue: "consumer",
      },
      licenseNumber: {
        type: DataTypes.STRING,
        unique: true,
      },
      onBoarded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      practitionerType: {
        type: DataTypes.ENUM(
          "agent/broker",
          "title/escrow",
          "mortgage broker",
          "appraiser",
          "loan officer"
        ),
        allowNull: true,
        defaultValue: null,
      },
      state: {
        type: DataTypes.STRING,
      },
      country: DataTypes.STRING,
      companyName: DataTypes.STRING,

      isConfirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
      userStatus: {
        type: DataTypes.ENUM("blocked", "unblocked"),
        defaultValue: "unblocked",
      },
      password: { type: DataTypes.STRING, allowNull: false },
      bio: DataTypes.TEXT,
      headShot: DataTypes.STRING,
      licenseSince: DataTypes.DATE,
      complete: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
      walletId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      hooks: {
        beforeCreate: async (user) => {
          user.email = user.email.toLowerCase();
        },
        beforeQuery: async (user) => {
          user.email = user.email.toLowerCase();
        },
      },
    }
  );
  return User;
};
