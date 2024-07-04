const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PractitionerNFT extends Model {
    static associate({ User, PropertyNFT }) {
      // define association here

      //  practitioner can have one practitionerNFT
      User.hasOne(PractitionerNFT, {
        foreignKey: "ownerId",
        as: "practitionerNFT",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      PractitionerNFT.belongsTo(User, {
        as: "owner",
      });
    }
  }

  PractitionerNFT.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PractitionerNFT",
      tableName: "practitionerNFTs",
      //   hooks: {
      //     beforeCreate: async (user) => {
      //       user.email = user.email.toLowerCase();
      //     },
      //     beforeQuery: async (user) => {
      //       user.email = user.email.toLowerCase();
      //     },
      //   },
    }
  );
  return PractitionerNFT;
};
