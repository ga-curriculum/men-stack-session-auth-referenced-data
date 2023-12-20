const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
