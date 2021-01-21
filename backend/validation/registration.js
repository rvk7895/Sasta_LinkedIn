const Validator = require('validator')
const isEmpty = require('is-empty')

module.exports = validateRegisterInput = data => {
    let errors = {};

    //to convert all objects to strings 
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    data.role = !isEmpty(data.role) ? data.role : "";

    if(Validator.isEmpty(data.role)){
        errors.message= "Role cannot be empty";
    }
    // Password checks
    if (!Validator.equals(data.password, data.password2)) {
        errors.message = "Passwords must match";
    }
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.message = "Password must be at least 6 characters";
    }
    if (Validator.isEmpty(data.password2)) {
        errors.message = "Confirm password field is required";
    }
    if (Validator.isEmpty(data.password)) {
        errors.message = "Password field is required";
    }


    // Email checks
    if (Validator.isEmpty(data.email)) {
        errors.message = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.message = "Email is invalid";
    }

    // Name checks
    if (Validator.isEmpty(data.name)) {
        errors.message = "Name field is required";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
}