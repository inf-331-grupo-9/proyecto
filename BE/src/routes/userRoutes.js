const express = require("express");
const router = express.Router();
const userData = require("../handlers/userHandlers");
const { hashPassword } = require("../lib/crypto");

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await userData.getUserByEmail(email);
    const hashedPassword = hashPassword(password);

    if (!user || hashedPassword !== user.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = 'runner' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    if (!['runner', 'enterprise'].includes(role)) {
      return res.status(400).json({ error: "Role must be 'runner' or 'enterprise'" });
    }

    const existingUser = await userData.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser = await userData.createUser({
      name,
      email,
      password: hashPassword(password),
      role
    });

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userData.getUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Legacy routes for backward compatibility
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
