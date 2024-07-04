exports.validationHandler = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { strict: true });
    next();
  } catch (error) {
    return res.status(400).json({ err: { status: 400, msg: error.errors[0] } });
  }
};
// exports.signUpValidationHandler = (schema) => async (req, res, next) => {
//   try {
//     await schema.validate(req.body, { strict: true });
//     next();
//   } catch (error) {
//     return res.status(400).json({ err: { status: 400, msg: error.errors[0] } });
//   }
// };
