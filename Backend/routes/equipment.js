const router = require('express').Router();
const service = require('../services/equipment');
// const { check, query } = require('express-validator/check');
const { check, query } = require('express-validator');
const base64Img = require('base64-img');
const fs = require('fs');
const path = require('path')
const uploadDir = path.resolve('uploads');
const equipDir = path.join(uploadDir, 'equipments');

// Show equipments
router.get('/', [
    query('page').not().isEmpty().isInt().toInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await service.findAll(req.query));
    } catch (ex) { res.error(ex); }
});

// Show equipments one record for edit
router.get('/:id', async (req, res) => {
    try {
        let equipment = await service.findOne({ eq_id: req.params.id });
        if (!equipment) throw new Error('Not found item.');
        equipment.eq_image = base64Img.base64Sync(path.join(equipDir, equipment.eq_image));
        res.json(equipment);
    } catch (ex) { res.error(ex); }
});

// Insert equipment
router.post('/', [
    check('eq_name').not().isEmpty(),
    check('eq_image').not().isEmpty()
], async (req, res) => {
    try {
        req.validate();
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        if (!fs.existsSync(equipDir)) fs.mkdirSync(equipDir);
        
        let filename = base64Img.imgSync(req.body.eq_image, equipDir, `equip-${Date.now()}`);
        filename = filename.split('\\')[filename.split('\\').length-1];
        req.body.eq_image = filename;

        res.json({ msg: await service.onCreate(req.body) });
    } catch(ex) {
        let delImg = path.join(equipDir, req.body.eq_image);
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex);
    }
});

// Delete equipment
router.delete('/:id', async (req, res) => {
    try {
        let item = await service.findOne({ eq_id: req.params.id })
        if (!item) throw new Error('Not found item.');
        let deleteItem = await service.onDelete(item.eq_id);
        let deleteImg = path.join(equipDir, item.eq_image);
        if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null);
        res.send(deleteItem);
    } catch (ex) { res.error(ex); }
});

// Edit equiment
router.put('/:id', async (req, res) => {
    try {
        let item, filename, updateItem, deleteImg;
        
        item = await service.findOne({ eq_id: req.params.id })
        if (!item) throw new Error('Not found item.');
        
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        if (!fs.existsSync(equipDir)) fs.mkdirSync(equipDir);
        if (req.body.eq_image !== '') {
            filename = base64Img.imgSync(req.body.eq_image, equipDir, `equip-${Date.now()}`);
            filename = filename.split('\\')[filename.split('\\').length-1];
            req.body.eq_image = filename;
        }
        updateItem = await service.onUpdate(req.params.id, req.body);
        // Check edit
        if (updateItem.affectedRows > 0 && req.body.eq_image !== '') {
            deleteImg = path.join(equipDir, item.eq_image);
            if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null);
            // res.send(deleteImg);
        }
        res.json( updateItem );
    } catch (ex) { res.error(ex); }
});

module.exports = router;