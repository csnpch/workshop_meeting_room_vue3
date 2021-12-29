const db = require('./../configs/database');
const config = require('./../configs');

module.exports = {
    
    findAll(value) {
        return new Promise((resolve, reject) => {
            let limitPage = config.limitPage;
            let startPage = ((value.page || 1) - 1) * limitPage;
            let sqls = {
                count: 'SELECT COUNT(eq_id) as rowsCount FROM tb_equipments',
                select: 'SELECT * FROM tb_equipments' 
            };

            if (value.search_key && value.search_text) {
                let key = value.search_key;
                let txt = value.search_text;
                let sqlSearch = ` WHERE ${db.escapeId(key)} LIKE ${db.escape(`%${txt}%`)}`;
                sqls.count += sqlSearch;
                sqls.select += sqlSearch;
            }
            // escape for anti sql inscaption!
            // escapeId to encode column
            // escape only to encode value

            // find row data
            db.query(sqls.count, (err, result) => {
                if (err) return reject(err);
                let items = { result: [], rows: result[0].rowsCount, limit: limitPage }

                // set list page
                sqls.select += ` ORDER BY eq_created DESC LIMIT ${db.escape(startPage)}, ${limitPage}`;
                db.query(sqls.select, (err, result) => {
                    items.result = result
                    if (err) return reject(err);
                    resolve(items);
                });

            });
        })
    },
    findOne(column) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM tb_equipments WHERE ? ', column, (err, result) => {
                if (err) return reject(err);
                resolve(result.length > 0 ? result[0] : null);
            });
        })
    },
    onCreate(value) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO tb_equipments SET ?', value, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    },
    onDelete(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM tb_equipments WHERE eq_id = ?', id, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    },
    onUpdate(id, value) {
        return new Promise((resolve, reject) => {
            let  $query = '';
            if (value.eq_image === '') {
                $query = `
                    UPDATE tb_equipments 
                    SET eq_name = ?,
                        eq_detail = ?
                    WHERE
                        eq_id = ?`;
                db.query($query, [
                    value.eq_name,
                    value.eq_detail,
                    id
                ], (err, result) => {
                    if (err) return (err);
                    resolve(result)
                });
            } else {
                $query = `
                    UPDATE tb_equipments
                    SET eq_name = ?,
                        eq_detail = ?,
                        eq_image = ?
                    WHERE
                        eq_id = ?`;
                db.query($query, [
                    value.eq_name,
                    value.eq_detail,
                    value.eq_image,
                    id
                ], (err, result) => {
                    if (err) return (err);
                    resolve(result)
                });
            }
        });
    }

}