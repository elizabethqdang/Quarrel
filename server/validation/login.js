const Validator = require("validator");
const validText = require("./valid-text");

module.exports = function validateLoginInput(data) {
    data.email = validText(data.email) ? data.email : "";
    data.password = validText(data.password) ? data.password : "";


    if (Validator.isEmpty(data.email)) {
        return {
					message:
						"No account found for this email. Retry, or Sign up for Quora.",
					isValid: false
				};
    }

    if (Validator.isEmpty(data.password)) {
        return {
					message: "Incorrect password. Reset Password",
					isValid: false
				};
    }

    return {
        message: "",
        isValid: true
    };
};

