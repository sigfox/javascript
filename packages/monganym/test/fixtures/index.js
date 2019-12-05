const mongoose = require('mongoose');

const { Schema } = mongoose;

class Fixtures {
  constructor(chance) {
    this.chance = chance;
    this.UserSchema = new Schema({
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        country: { type: String, required: true }
      }
    });
    this.UserModel = mongoose.model('users', this.UserSchema);
  }

  createUser() {
    const User = this.UserModel;
    const user = new User({
      name: this.chance.string(),
      email: this.chance.string(),
      address: {
        name: this.chance.string(),
        phone: this.chance.phone(),
        country: this.chance.country()
      }
    });
    return user.save();
  }

  createUsers(count = 10) {
    const range = [...Array(count).keys()];
    return Promise.all(range.map(() => this.createUser()));
  }
}

module.exports = Fixtures;
