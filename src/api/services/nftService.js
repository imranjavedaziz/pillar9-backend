const { Op } = require("sequelize");
const { PropertyNFT, User, PractitionerNFT } = require("../models");

class nftService {
  async getPropertyNFT(id) {
    return await PropertyNFT.findOne({ id });
  }
  async getPropertyNFTs(query) {
    console.log("id", query);
    return await PropertyNFT.findAll({
      where: query,
      include: { model: User, as: "owner" },
      order: [["id", "DESC"]],
    });
  }

  async createPropertyNFT(data) {
    return await PropertyNFT.create(data);
  }
  async updatePropertyNFT(id, data) {
    console.log("data", data);
    return await PropertyNFT.update(data, { where: { id }, returning: true, plain: true });
  }
  async deletePropertyNFT(id) {
    return await PropertyNFT.destroy({ where: { id } });
  }

  // Practitioner NFTs
  async getPractitionerNFT(id) {
    return await PractitionerNFT.findOne({ id });
  }
  async getPractitionerNFTs(query) {
    return await PractitionerNFT.findAll({
      where: query,
      // include: { model: User, as: "owner" },
      // order: [["id", "DESC"]],
    });
  }
  updatePractitionerNFT(id, data) {
    return PractitionerNFT.update(data, { where: { id }, returning: true, plain: true });
  }
  deletePractitionerNFT(id) {
    return PractitionerNFT.destroy({ where: { id } });
  }
  async createPractitionerNFT(data) {
    return await PractitionerNFT.create(data);
  }
  async getAllPractitioner(query) {
    return await PractitionerNFT.findAll();
  }
}
module.exports = { nftService: new nftService() };
