const express   = require('express');
const router    = express.Router();

const UsersController = require('../controllers/usersController');
const Authentication = require('../model/authentication');
const MailListController = require('../controllers/mailListController');

/**
 * Users Routes
 */

router.get('/', Authentication.authenticate("admin"), UsersController.get);

router.post('/register', UsersController.create);
router.post('/signin', UsersController.signin);
router.post('/signout', UsersController.signout);
router.post('/resetPassword', UsersController.resetPassword);
router.get('/profile', UsersController.getProfile);

router.get('/application', UsersController.getApplication);
router.post('/application/save', UsersController.saveApplication);
router.post('/application/submit', UsersController.submitApplication);

router.get('/:uid', Authentication.authenticate("user"), UsersController.getByEmail);
router.patch('/:uid', Authentication.authenticate("user"), UsersController.update);
router.delete('/:uid', Authentication.authenticate("admin"), UsersController.delete);

module.exports = router;