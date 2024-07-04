const { validationHandler, verifyJwt } = require("../../middlewares");
const { nftController } = require("../controllers");
const { propertyNFTSchema } = require("../validation");
const nftRoutes = require("express").Router();

// practitioner nft routes
nftRoutes.get("/practitioner-all", verifyJwt, nftController.getAllNFTS); //get all
nftRoutes.get("/practitioner", verifyJwt, nftController.getPractitionerNFTs); //get all
nftRoutes.put("/practitioner/:id", verifyJwt, nftController.updatePractitionerNFT); //update
nftRoutes.get("/practitioner/:id", verifyJwt, nftController.getPractitionerNFT); //get one
nftRoutes.delete("/practitioner/:id", verifyJwt, nftController.deletePractitionerNFT); //delete
nftRoutes.post("/practitioner", verifyJwt, nftController.mintPractitionerNFT); //create new, mint
// NFTRoutes
// consumer nft routes
nftRoutes.get("/", verifyJwt, nftController.getNFTs); //get all
nftRoutes.post("/mint", verifyJwt, validationHandler(propertyNFTSchema), nftController.mintNFT); //create new, mint
nftRoutes.put("/:id", verifyJwt, nftController.updateNFT); //update
nftRoutes.get("/:id", verifyJwt, nftController.getNFT); //get one
nftRoutes.delete("/:id", verifyJwt, nftController.deleteNFT); //delete

module.exports = nftRoutes;
