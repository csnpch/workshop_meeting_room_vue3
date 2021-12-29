const router = require('express').Router();
const { query, check } = require('express-validator/check')
const roomService = require('./../services/room');
const bookingService = require('./../services/booking');

// Show booking
router.get('/', [
    query('page').isInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await roomService.findAll(req.query));
    } catch (ex) { res.error(ex); }
});

// Show history book room
router.get('/history', [
    query('page').isInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await bookingService.findHistory(req.query));
    } catch (ex) { res.error(ex); }
});

// Find detail booking
router.get('/room/:id', async (req, res) => {
    try {
        res.json(await roomService.findDetailForBooking(req.params.id));
    } catch (ex) { res.error(ex); }
});

// Insert booking
router.post('/', [
    check('tb_rooms_r_id').isInt(),
    check('bk_title').not().isEmpty(),
    check('bk_detail').exists(),
    check('bk_time_start').custom( value => !isNaN(Date.parse(value)) ),
    check('bk_time_end').custom( value => !isNaN(Date.parse(value)) ),
    check('equipments').custom( value => {
        let isArray = Array.isArray(value)
        if (isArray && value.length > 0) {
            return value.filter(item => isNaN(item)).length === 0;
        }
        return isArray;
    }),
] ,async (req, res) => {
    try {
        req.validate();
        req.body.tb_users_u_id = req.session.userLogin.u_id;
        res.json(await bookingService.onCreate(req.body));
    } catch (ex) {
        res.error(ex);
    }
});


module.exports = router;