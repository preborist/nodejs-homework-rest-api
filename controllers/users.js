const jwt = require('jsonwebtoken');
require('dotenv').config();
const {
  findById,
  findByEmail,
  create,
  updateToken,
} = require('../model/users');
const { HttpCode } = require('../helpers/constatns');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const signup = async (req, res, next) => {
  try {
    const user = await findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email is already used',
      });
    }
    const newUser = await create(req.body);
    const { id, email, subscription } = newUser;
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: { id, email, subscription },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findByEmail(email);
    const isValidPassword = await user?.validPassword(password);
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }
    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '2h' });
    await updateToken(user.id, token);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { token },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {};

const current = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { email, subscription },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  signup,
  login,
  logout,
  current,
};