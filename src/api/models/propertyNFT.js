const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PropertyNFT extends Model {
    static associate({ User, PractitionerNFT }) {
      // define association here

      //one property can have one practitionerNFT
      // PractitionerNFT.hasMany(PropertyNFT, {
      //   as: "properties",
      //   foreignKey: "practitionerNFTId",
      //   allowNull: true,
      // });
      // PropertyNFT.belongsTo(PractitionerNFT, {
      //   as: "practitionerNFT",
      //   foreignKey: "practitionerNFTId",
      //   allowNull: true,
      // });

      User.hasMany(PropertyNFT, {
        foreignKey: "ownerId",
        as: "properties",
        allowNull: true,
      });
      PropertyNFT.belongsTo(User, {
        as: "owner",
        allowNull: true,
      });
    }
  }

  PropertyNFT.init(
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
      agentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: false,
        references: {
          model: "users",
          key: "id",
          allowNull: true,
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
      // practitionerNFTId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: "propertyNFTs",
      //     key: "id",
      //     onDelete: "CASCADE",
      //     onUpdate: "CASCADE",
      //   },
      // },
      title: DataTypes.STRING,
      image: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      docCategory: {
        type: DataTypes.ENUM("deed", "settlement"),
        allowNull: false,
      },
      document: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // categories: {
      //   type: DataTypes.STRING,
      //   get: function () {
      //     const categories = this.getDataValue("categories");
      //     if (!categories) return;
      //     return JSON.parse(categories);
      //   },
      //   set: function (value) {
      //     return this.setDataValue("categories", JSON.stringify(value));
      //   },
      // },
    },
    {
      sequelize,
      modelName: "PropertyNFT",
      tableName: "propertyNFTs",
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
  return PropertyNFT;
};
