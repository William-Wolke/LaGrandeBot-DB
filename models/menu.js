const mongoose = require('mongoose');
const menuDefault = require('./defaults/menuDefault.json');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
    default: menuDefault.price
  },
  currency: {
    type: String,
    default: menuDefault.currency,
    trim: true,
    lowercase: true,
  },
  emoji: {
    type: String,
    required: true,
    default: menuDefault.emoji,
    trim: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now()
  },
  updatedAt: {
    type: Date,
    default: () => Date.now()
  },
});

menuSchema.statics.findDuplicateName = async function(name) {
  const menuList = await this.find().byName(name);
  console.log(menuList);
  if (menuList[0] !== undefined) return true;
  return false;
}

menuSchema.query.byName = function(name) {
  return this.where({name: new RegExp(name, 'i') });
}

menuSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Menu', menuSchema)