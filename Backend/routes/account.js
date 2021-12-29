const router = require('express').Router();
const { check } = require('express-validator');
const service = require('./../services/account');
const { authenticated } = require('../configs/security');

router.post('/register', [
        check('u_username').not().isEmpty().isLength({ min: 5, max: 15 }),
        check('u_password').not().isEmpty().isLength({ min: 8, max: 64 }),
        check('u_firstname').not().isEmpty().isLength({ max: 45 }),
        check('u_lastname').not().isEmpty().isLength({ max: 45 }),
    ], async (req, res) => {
        try {
            req.validate();
            res.json(await service.onRegister(req.body));
        } catch (err) {
            res.error(err);
        }
});

router.post('/login', [
    check('u_username').not().isEmpty(),
    check('u_password').not().isEmpty()
], async (req, res) => {
    try {
        req.validate();
        let userLogin = await service.onLogin(req.body);
        req.session.userLogin = userLogin;
        res.json(userLogin);
    } catch (ex) {
        res.error(ex);
    }
});


router.get('/checkUserLogin', authenticated, (req, res) => {
    try {
        if (req.session.userLogin) {
            res.json(req.session.userLogin);
        }
        throw new Error('Unauthorize.')
    } catch (ex) {
        res.error(ex, 401);
    }
})

// logout
router.get('/logout', (req, res) => {
    try {
        delete req.session.userLogin;
        res.json({msg:"logout"});
    } catch (ex) {
        res.error(ex);
    }
})

module.exports = router;
