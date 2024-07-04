"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // await queryInterface.addColumn("users", "complete", {
    //   type: Sequelize.BOOLEAN,
    //   defaultValue: false,
    //   allowNull: false,
    // });
    // await queryInterface.addColumn("users", "bio", {
    //   type: Sequelize.TEXT,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("users", "headShot", {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("users", "licenseSince", {
    //   type: Sequelize.DATE,
    //   allowNull: true,
    // });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("users", "complete");
    await queryInterface.removeColumn("users", "bio");
    await queryInterface.removeColumn("users", "headShot");
    await queryInterface.removeColumn("users", "licenseSince");
  },
};
