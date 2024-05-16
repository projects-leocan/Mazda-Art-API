const bcrypt = require("bcrypt")

exports.passwordHashing = async (password) => {
    try {
        const saltRounds = 10;
        // Generate a salt
        const salt = await bcrypt.genSalt(saltRounds);
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        // Handle error
        console.error('Error hashing password:', error);
        return "Error in hashing";
    }
}