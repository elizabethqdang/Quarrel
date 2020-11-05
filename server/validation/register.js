const Validator = require("validator");
const validText = require("./valid-text");

module.exports = function  validateRegisterInput(data) {
    data.fname = validText(data.fname) ? data.fname : "";
    data.lname = validText(data.lname) ? data.lname : "";
    data.email = validText(data.email) ? data.email : "";
    data.password = validText(data.password) ? data.password : "";

    if (Validator.isEmpty(data.fname) && Validator.isEmpty(data.lname)) {
        return { message: "Please use your full name", isValid: false };
    }
		
		if (!Validator.isLength(data.fname, { min: 2 })) {
			return { message: "", isValid: false };
		}

    if (Validator.isEmpty(data.lname)) {
        return { message: "", isValid: false };
    }

    // if (!Validator.isLength(data.email, { min: 4 })) {
    //     return { message: "", isValid: false }
    // }

    // if (Validator.isEmpty(data.email)) {
    //     return { message: "", isValid: false };
    // }

    if (!Validator.isEmail(data.email)) {
        return { message: "The email address you entered is not valid.", isValid: false };
    }

    if (Validator.isEmpty(data.password)) {
        return {
					message: "Please use a password at least 8 characters long.",
					isValid: false
				};
    }

    if (!Validator.isLength(data.password, { min: 8 })) {
        return {
					message: "Please use a password at least 8 characters long.",
					isValid: false
				};
    }

    return {
        message: "Successfully registered",
        isValid: true
    };
}

// Unconfirmed account already 