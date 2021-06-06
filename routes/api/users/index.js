const express = require('express');
const router = express.Router();
const ctrl = require('../../../controllers/users');
const guard = require('../../../helpers/guard');
const { schemaSignupUser } = require('./validation');
const upload = require('../../../helpers/upload');

router.post('/signup', schemaSignupUser, ctrl.signup);
router.post('/login', schemaSignupUser, ctrl.login);
router.post('/logout', guard, ctrl.logout);
router.post('/current', guard, ctrl.current);
router.patch('/avatars', [guard, upload.single('avatar')], ctrl.avatars);

module.exports = router;
