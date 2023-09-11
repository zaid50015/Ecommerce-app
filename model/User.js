const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const userSchema = new Schema({
  email: { type: String, required: true, unique: true,  },
  password: { type: String, required: true , select: false,},
  role: { type: String, required: true, default:'user' },
  addresses: { type: [Schema.Types.Mixed] }, 
  // TODO:  We can make a separate Schema for this
  name: { type: String },
  orders: { type: [Schema.Types.Mixed] }
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


const virtual = userSchema.virtual('id');
virtual.get(function () {
  return this._id;
});
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});


exports.User = mongoose.model('User', userSchema);