const Validator = require("validator");
const isEmpty = require("is-empty");

function validateLoginInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = { validateLoginInput };
