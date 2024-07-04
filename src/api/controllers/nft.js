// const { User } = require("../models");

const { nftService } = require("../services");

class nftController {
  async mintNFT(req, res, next) {
    try {
      const { user } = req;
      console.log("user", user.id);
      const nft = await nftService.createPropertyNFT({ ...req.body, ownerId: user.id });
      return res.status(200).json({ success: true, message: "NFT minted!", nft });
    } catch (error) {
      console.log(error);
      console.log("------------------------------------------haseeb");
      return res.status(400).json({ success: false, message: error.message });
    }
  }
  async getNFTs(req, res, next) {
    try {
      const { user } = req;
      const nfts = await nftService.getPropertyNFTs({ ownerId: user.id });
      return res.status(200).json({ success: true, message: "NFTs fetched!", nfts });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
  async getNFT(req, res, next) {
    try {
      const { id } = req.params;
      const nft = await nftService.getPropertyNFT(id);
      return res.status(200).json({ success: true, message: "NFT fetched!", nft });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
  async updateNFT(req, res, next) {
    try {
      const { id } = req.params;
      const nft = await nftService.updatePropertyNFT(id, req.body);
      return res.status(200).json({ success: true, message: "NFT updated!", nft });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ success: false, message: err.message });
    }
  }
  async deleteNFT(req, res, next) {
    try {
      const { id } = req.params;
      const nft = await nftService.deletePropertyNFT(id);
      return res.status(200).json({ success: true, message: "NFT deleted!", nft });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ success: false, message: err.message });
    }
  }
  //  practitioner NFTs
  async mintPractitionerNFT(req, res, next) {
    try {
      const { user } = req;

      const { agentId } = req.body;
      const agent = await nftService.getPractitionerNFT(agentId);
      if (agent) return res.status(400).json({ success: false, message: "Invalid agent" });
      const nft = await nftService.createPractitionerNFT({
        ...req.body,
        ownerId: user.id,
      });
      return res.status(200).json({ success: true, message: "NFT minted!", nft });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
  async getPractitionerNFTs(req, res, next) {
    try {
      const { user } = req;
      const nfts = await nftService.getPractitionerNFT({ ownerId: user.id });
      return res.status(200).json({ success: true, message: "NFTs fetched!", nfts });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
  async getPractitionerNFT(req, res, next) {
    try {
      const { id } = req.params;
      const nft = await nftService.getPractitionerNFT(id);
      return res.status(200).json({ success: true, message: "NFT fetched!", nft });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
  async updatePractitionerNFT(req, res, next) {
    try {
      const { id } = req.params;
      const nft = await nftService.updatePractitionerNFT(id, req.body);
      return res.status(200).json({ success: true, message: "NFT updated!", nft });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ success: false, message: err.message });
    }
  }
  async deletePractitionerNFT(req, res, next) {
    try {
      const { id } = req.params;
      const nft = await nftService.deletePractitionerNFT(id);
      return res.status(200).json({ success: true, message: "NFT deleted!", nft });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ success: false, message: err.message });
    }
  }
  async getAllNFTS(req, res) {
    try {
      const nfts = await nftService.getAllPractitioner();
      return res.status(200).json({ success: true, data: { nfts } });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
module.exports = { nftController: new nftController() };
