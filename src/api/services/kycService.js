const { Op } = require("sequelize");
const { Kyc } = require("../models");

class kycService {
  async findOne(query) {
    return await Kyc.findOne({ where: query });
  }

  async create(data) {
    return await Kyc.create(data);
  }
}
module.exports = { kycService: new kycService() };
