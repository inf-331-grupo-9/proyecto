const express = require("express");
const router = express.Router();
const userData = require("../handlers/userHandlers");
const { hashPassword } = require("../lib/crypto");

router.post("/", async (req, res) => {
  const data = req.body;

  const user = await userData.getUserByEmail(data.email);
  const hashedPassword = hashPassword(data.password);

  if (!user || hashedPassword !== user.password) {
    return res.status(400).json({ reason: "Credenciales Incorrectas!" });
  } else if (hashedPassword === user.password) {
    return res.status(200).json(user);
  }
});

router.put("/", async (req, res) => {
  const data = req.body;
  const user = await userData.getUserByEmail(data.email);

  if (user) {
    return res.status(409).json({ reason: "Usuario Existente" });
  }

  const newUser = await userData.createUser({
    ...data,
    password: hashPassword(data.password),
  });
  res.status(200).json(newUser);
});

module.exports = router;
