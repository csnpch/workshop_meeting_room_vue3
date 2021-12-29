const router = require('express').Router();
const service = require('../services/room');
// const { check, query } = require('express-validator/check');
const { check, query } = require('express-validator');
const base64Img = require('base64-img');
const fs = require('fs');
const path = require('path')
const uploadDir = path.resolve('uploads');
const roomDir = path.join(uploadDir, 'rooms');

// Show rooms
router.get('/', [
    query('page').not().isEmpty().isInt().toInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await service.findAll(req.query));
    } catch (ex) { res.error(ex); }
});

// Show rooms one record for edit
router.get('/:id', async (req, res) => {
    try {
        let room = await service.findOne({ r_id: req.params.id });
        if (!room) throw new Error('Not found item.');
        room.r_image = base64Img.base64Sync(path.join(roomDir, room.r_image));
        res.json(room);
    } catch (ex) { res.error(ex); }
});

// Insert room
router.post('/', [
    check('r_image').not().isEmpty(),
    check('r_name').not().isEmpty(),
    check('r_capacity').isInt(),
    check('r_detail').exists()
], async (req, res) => {
    try {
        req.validate();
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        if (!fs.existsSync(roomDir)) fs.mkdirSync(roomDir);
        
        let filename = base64Img.imgSync(req.body.r_image, roomDir, `room-${Date.now()}`);
        filename = filename.split('\\')[filename.split('\\').length-1];
        req.body.r_image = filename;

        res.json({ msg: await service.onCreate(req.body) });
    } catch(ex) {
        let delImg = path.join(roomDir, req.body.r_image);
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex);
    }
});

// Delete room
router.delete('/:id', async (req, res) => {
    try {
        let item = await service.findOne({ r_id: req.params.id })
        if (!item) throw new Error('Not found item.');
        let deleteItem = await service.onDelete(item.r_id);
        let deleteImg = path.join(roomDir, item.r_image);
        if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null);
        res.send(deleteItem);
    } catch (ex) { res.error(ex); }
});

// Edit room
router.put('/:id', async (req, res) => {
    try {
        let item, filename, updateItem, deleteImg;
        
        item = await service.findOne({ r_id: req.params.id })
        if (!item) throw new Error('Not found item.');
        
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        if (!fs.existsSync(roomDir)) fs.mkdirSync(roomDir);
        if (req.body.r_image !== '') {
            filename = base64Img.imgSync(req.body.r_image, roomDir, `equip-${Date.now()}`);
            filename = filename.split('\\')[filename.split('\\').length-1];
            req.body.r_image = filename;
        }
        updateItem = await service.onUpdate(req.params.id, req.body);
        // Check edit
        if (updateItem.affectedRows > 0 && req.body.r_image !== '') {
            deleteImg = path.join(roomDir, item.r_image);
            if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null);
            // res.send(deleteImg);
        }
        res.json( updateItem );
    } catch (ex) { res.error(ex); }
});

module.exports = router;