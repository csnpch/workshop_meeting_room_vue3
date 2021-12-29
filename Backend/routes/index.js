const router = require('express').Router();
const { authenticated } = require('./../configs/security');
// const account = require('./account')

//! Account route
// Account router
router.use('/account', require('./account'));
// Equipment router
router.use('/equipment', authenticated, require('./equipment'))
// Room router
router.use('/room', authenticated, require('./room'))
// Booking router
router.use('/booking', authenticated, require('./booking'))

module.exports = router;