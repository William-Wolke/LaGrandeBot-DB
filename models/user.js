const mongoose = require('mongoose');
const userDefault = require('./defaults/userDefault.json');
const NFT = require('./nft.js');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  money: {
    type: Number,
    default: userDefault.money
  },
  bought: {
    type: Number,
    default: userDefault.bought,
  },
  spent: {
    type: Number,
    default: userDefault.spent
  },
  createdAt : {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt : {
    type: Date,
    default: () => Date.now(),
  },
  ownedNFT: {
    type: [mongoose.SchemaType.ObjectId],
    ref: "NFT"
  }
});

userSchema.statics.addMoney = async function(name, amount) {
  try {
    const user = await this.findOne().byName(name);
    user.money = Number(user.money) + Number(amount);
    user.save();
    return user.money;
  } catch (e) {
    console.log(e.message);
    return false;
  }
}

userSchema.statics.subtractMoney = async function async(name, amount) {
  try {
    let user = await this.findOne().byName(name);
    user.money = Number(user.money) - Number(amount);
    if (user.money < 0) {
      throw new Error("Användaren har för lite pengar");
    }
    user.save();
    return {success: true, message: `Pengarna uppdaterades du har nu ${user.money}`};
  } catch (e) {
    console.log(e.message);
    return {success: false, message: e.message};
  }
}

userSchema.statics.newFoodTransaction = async function(name, amount) {
  try {
    const user = await this.findOne().byName(name);
    user.money = Number(user.money) - Number(amount);
    user.bought ++;
    user.spent = Number(user.spent) + Number(amount);
    if (user.money < 0) {
      throw new Error("Användaren har för lite pengar");
    }
    user.save();
    return {success: true, message: `Pengar updaterade du har nu ${user.money} pengar`};
  } catch (e) {
    console.log(e.message);
    return {success: false, message: e.message};
  }
}

// userSchema.methods.nftTransaction = function(owner, buyer, nftName) {
  
// }

userSchema.statics.leaderBoard = function() {
  return this.find().sort({spent: -1, money: -1});
}

userSchema.statics.findDuplicateName = async function(name) {
  const userList = await this.find().byName(name);
  console.log(userList);
  if (userList[0] !== undefined) return true;
  return false;
}

userSchema.query.byName = function(name) {
  return this.where({ name: new RegExp(name , 'i')})
}

userSchema.virtual('general').get(function() {
  return `${this.name}s stats\nPengar: ${this.money}\nAntal köpta saker: ${this.bought}\nSpenderade pengar: ${this.spent}\nSkapad: ${this.createdAt}`
});

// userSchema.virtual('nftList').get(function() {
//   return this.ownedNFT.map((item) => {
//     return `${item.}`
//   })
// });

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now;
  next();
});

module.exports = mongoose.model('User', userSchema)