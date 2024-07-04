"use strict";

/** @type {import('sequelize-cli').Migration} */
const crypto = require("crypto");
const { QueryTypes } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // add column walletId to users table
    await queryInterface.addColumn("users", "walletId", {
      type: Sequelize.STRING,
      unique: true,
    });
    //  feed data to walletId column for existing users
    await queryInterface.sequelize
      .query(`SELECT id from users`, {
        type: QueryTypes.SELECT,
      })
      .then((rows) => {
        rows.map((row) => {
          queryInterface.sequelize.query(
            `UPDATE users SET "walletId"='${
              new Date().getTime().toString(36) + crypto.randomBytes(20).toString("hex")
            }' WHERE id=${row.id};`
          );
        });
        Promise.resolve();
      });
    // change walletId column to not null
    await queryInterface.changeColumn("users", "walletId", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
