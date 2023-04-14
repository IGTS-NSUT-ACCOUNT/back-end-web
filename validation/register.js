const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateRegisterInput(data) {
    let errors = {};
    // Convert empty fields to an empty string so we can use validator functions
    data.fname = !isEmpty(data.fname) ? data.fname : "";
    data.lname = !isEmpty(data.lname) ? data.lname : "";
    data.number = !isEmpty(data.number) ? data.number : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    data.organisation = !isEmpty(data.organisation) ? data.organisation : "";

    // Name checks
    if (Validator.isEmpty(data.fname)) {
        errors.fname = "First Name field is required";
    }
    if (Validator.isEmpty(data.lname)) {
        errors.lname = "Last Name field is required";
    }
    // Number checks
    if (Validator.isEmpty(data.number)) {
        errors.number = "Mobile Number field is required";
    } else if(!Validator.isLength(data.number,{min: 10, max: 10})) {
        errors.number = "Mobile Number should be of 10 digits"
    }
    // Email checks
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }
    // Password checks
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }
    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    }
    if (!Validator.isStrongPassword(data.password, { minLength: 6})) {
        errors.password = "Wrong password type! Please follow all guidelines to create a password.";
    }
    // Default password requirements
    // { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }
    //organisation Check
    if (Validator.isEmpty(data.organisation)) {
        errors.organisation = "Organisation field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};