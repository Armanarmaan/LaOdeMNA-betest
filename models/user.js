const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    max: 500,
    mutable: true
  },
  accountNumber: {
    type: Number,
    required: true,
    unique : true,
    dropDups: true,
    mutable: true
  },
  emailAddress: {
    type: String,
    required: true,
    max: 500,
    mutable: true
  },
  identityNumber: {
    type: Number,
    required: true,
    unique : true,
    dropDups: true,
    mutable: true
  }
});

module.exports = mongoose.model('user', userSchema);