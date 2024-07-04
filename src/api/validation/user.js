const yup = require("yup");
const completeProfileSchema = yup.object().shape({
  practitionerType: yup.string().required("Practitioner Type is required field"),
  state: yup.string().required("State is required field"),
  country: yup.string().required("Country is required field"),
  companyName: yup.string().required("Company Name is required field"),
  licenseNumber: yup.string().when("country", {
    is: "us",
    then: yup.string().required("LicenseNumber/NMLS/TitleNumber is required for US"),
    otherwise: yup.string(),
  }),
});
module.exports = { completeProfileSchema };
