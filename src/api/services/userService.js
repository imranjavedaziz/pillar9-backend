const { Op } = require("sequelize");
const { User, UserToken } = require("../models");

class userService {
  async getUserById(id) {
    return await User.findOne({ where: { id } });
  }
  async getUserByEmailPhone(query) {
    return await User.findOne({ where: { [Op.or]: { ...query } } });
  }
  async getUser(query) {
    return await User.findOne({ where: { ...query } });
  }
  async getUserByEmail(email) {
    return await User.findOne({
      where: { email },
    });
  }
  async createUser(user) {
    return await User.create(user);
  }
  async resetPasswordToken(data) {
    return await UserToken.create({
      ...data,
    });
  }
  async getResetPasswordToken(token) {
    return await UserToken.findOne({
      where: { token },
    });
  }
  async updateUser(query, data) {
    const updatedUser = await User.update(data, {
      where: { ...query },
      returning: true,
      raw: true,
      nest: true,
      plain: true,
    });
    return updatedUser[1];
  }
  async deleteResetPasswordToken(token) {
    return await UserToken.destroy({
      where: {
        token,
      },
    });
  }
  deleteUser(query) {
    return User.destroy({
      where: { ...query },
      returning: true,
      raw: true,
      nest: true,
      plain: true,
    });
  }
}
module.exports = { userService: new userService() };
