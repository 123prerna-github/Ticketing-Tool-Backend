const mongoose = require('mongoose');
const validator = require('validator');


const emailSchema = new mongoose.Schema({
  firstName:{
    type: String,
    required: [true, 'first name is required'],
  },
  lastName:{
    type: String,
    required: [true, 'last name is required'],
  },
  password:{
    type: String,
    required: [true, 'password is required'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    trim: true,
    validate: [validator.isEmail, 'invalid email'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user' // Default role is 'user'
},
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive'],
  },
  createdBy: {
      type: mongoose.Schema.Types.ObjectId
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  }
});


module.exports = emailSchema;