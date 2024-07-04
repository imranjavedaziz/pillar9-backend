const yup = require("yup");

const registerSchema = yup.object().shape({
  firstName: yup.string().required("First name is required field"),
  lastName: yup.string().required("Last name is required field"),
  phoneNumber: yup
    .string()
    .required("Phone number is required field")
    .matches(/^\+[1-9]\d{1,14}$/, "Invalid Phone number format, Please use format eg +12345678901"),
  role: yup.string().required("Role is required field"),
  // .length(15),
  email: yup.string().email(),
  password: yup
    .string("Password must be string")
    .required("Password is required field")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password Must contain Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  // country: yup.string().when("role", {
  //   is: "practitioner",
  //   then: yup.string().required("country is required field"),
  //   otherwise: yup.string(),
  // }),
  // licenseNumber: yup.string().when("country", {
  //   is: "us",
  //   then: yup.string().required("LicenseNumber/NMLS/TitleNumber is required field"),
  //   otherwise: yup.string(),
  // }),
  // practitionerType: yup
  //   .string()
  //   .oneOf(["agent/broker", "title/escrow", "mortgage broker", "appraiser", "loan officer"])
  //   .when("role", {
  //     is: "practitioner",
  //     then: yup.string().required("Practitioner Type is required field"),
  //     otherwise: yup.string(),
  //   }),
  // state: yup.string().when("role", {
  //   is: "practitioner",
  //   then: yup.string().required("State is required field"),
  //   otherwise: yup.string(),
  // }),
  // companyName: yup.string().when("role", {
  //   is: "practitioner",
  //   then: yup.string().required("Company Name is required field"),
  //   otherwise: yup.string(),
  // }),
});
//login schema-----------
const loginSchema = yup.object().shape({
  email: yup
    .string("Value must be a string")
    .email("Email format not correct")
    .required("Email is required field"),
  password: yup.string("Password must be string").required("Password is required field"),
});
module.exports = { registerSchema, loginSchema };
