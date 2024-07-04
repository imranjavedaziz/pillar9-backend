const yup = require("yup");

const propertyNFTSchema = yup.object().shape({
  title: yup.string().required(),
  image: yup.string().required(),
  agentId: yup.number().required(),
  docCategory: yup.string().required(),
  document: yup.string().required(),
  address: yup.string().required(),
});

module.exports = { propertyNFTSchema };
