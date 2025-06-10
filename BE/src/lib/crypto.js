const crypto = require("crypto");

const SALT = "SALT_MY_PASSWORD_1234";

function hashPassword(password) {
  const hash = crypto
    .pbkdf2Sync(password, SALT.toString("hex"), 10000, 32, "sha256")
    .toString("hex");
  return hash;
}

module.exports = { hashPassword };
