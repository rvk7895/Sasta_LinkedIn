const Validator = require("validator");
const isEmpty = require("is-empty");

const validateLoginInput = data => {
  let errors = {};

// Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

// Password checks
  if (Validator.isEmpty(data.password)) {
    errors.message = "Password field is required";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.message = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.message = "Email is invalid";
  }

return {
    errors,
    isValid: isEmpty(errors)
  }

}

module.exports = validateLoginInput 