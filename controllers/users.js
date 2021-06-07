const jwt = require('jsonwebtoken');
require('dotenv').config();
const {
  findByEmail,
  create,
  updateToken,
  updateAvatar,
} = require('../model/users');
const { HttpCode } = require('../helpers/constatns');
const UploadAvatar = require('../services/upload-avatars-local');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;

const signup = async (req, res, next) => {
  try {
    const user = await findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'Conflict',
        code: HttpCode.CONFLICT,
        message: 'Email in use',
      });
    }
    const newUser = await create(req.body);
    const { id, email, subscription, avatarURL } = newUser;
    return res.status(HttpCode.CREATED).json({
      status: 'Created',
      code: HttpCode.CREATED,
      data: { id, email, subscription, avatarURL },
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
        status: 'Unauthorized',
        code: HttpCode.UNAUTHORIZED,
        message: 'Email or password is wrong',
      });
    }
    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '2h' });
    await updateToken(user.id, token);
    const { subscription } = user;
    return res.status(HttpCode.OK).json({
      status: 'OK',
      code: HttpCode.OK,
      data: { token, user: { email, subscription } },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  await updateToken(req.user.id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const current = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    return res.status(HttpCode.OK).json({
      status: 'OK',
      code: HttpCode.OK,
      data: { email, subscription },
    });
  } catch (e) {
    next(e);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatar(AVATARS_OF_USERS);
    const avatarURL = await uploads.saveAvatarToStatic({
      idUser: id,
      pathFile: req.file.path,
      name: req.file.filename,
      oldFile: req.user.avatarURL,
    });
    await updateAvatar(id, avatarURL);
    return res.json({ status: 'OK', code: HttpCode.OK, data: { avatarURL } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  current,
  avatars,
};
