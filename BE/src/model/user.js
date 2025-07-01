const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['runner', 'enterprise'], 
    default: 'runner' 
  },
  createdAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.model('User', userSchema, "users");

module.exports = { UserModel };
