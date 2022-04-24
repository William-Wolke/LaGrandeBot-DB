const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  callBack: {
    type: String,
    required: true,
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

keywordSchema.statics.findDuplicateName = async function(name) {
  const keywordList = await this.find().byName(name);
  console.log(keywordList);
  if (keywordList[0] !== undefined) return true;
  return false;
}

keywordSchema.query.byName = function(name) {
  return this.where({name: new RegExp(name, 'i') });
}

keywordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Keyword', keywordSchema);