// Model 1115 - Socialmedia_react_BE
const mongoose = require('mongoose');

const schema1115 = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  },
  
  metadata: {
    type: Map,
    of: String
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

schema1115.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Model1115', schema1115);
