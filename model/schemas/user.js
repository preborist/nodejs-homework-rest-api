const { Schema, model } = require('mongoose');
const gravatar = require('gravatar');
const { Subscription } = require('../../helpers/constatns');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 6;
const { nanoid } = require('nanoid');

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/gi;
        return re.test(String(value).toLowerCase());
      },
    },
    subscription: {
      type: String,
      enum: [Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS],
      default: Subscription.STARTER,
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: 250 }, true);
      },
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      required: [true, 'Verify token is required'],
      default: nanoid(),
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
});

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(String(password), this.password);
};

const User = model('user', userSchema);

module.exports = User;
