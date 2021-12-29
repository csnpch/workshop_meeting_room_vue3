const db = require('./../configs/database');
const config = require('./../configs');
const table = 'tb_rooms';

module.exports = {
    
    findAll(value) {
        return new Promise((resolve, reject) => {
            let limitPage = config.limitPage;
            let startPage = ((value.page || 1) - 1) * limitPage;
            let sqls = {
                count: `SELECT COUNT(r_id) as rowsCount FROM ${table}`,
                select: `SELECT * FROM ${table}` 
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
                sqls.select += ` ORDER BY r_created DESC LIMIT ${db.escape(startPage)}, ${limitPage}`;
                db.query(sqls.select, (err, result) => {
                    items.result = result
                    if (err) return reject(err);
                    resolve(items);
                });

            });
        });
    },
    findOne(column) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${table} WHERE ? `, column, (err, result) => {
                if (err) return reject(err);
                resolve(result.length > 0 ? result[0] : null);
            });
        })
    },
    onCreate(value) {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO ${table} SET ?`, value, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    },
    onDelete(id) {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM ${table} WHERE r_id = ?`, id, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    },
    onUpdate(id, value) {
        return new Promise((resolve, reject) => {
            let  $query = '';
            if (value.r_image === '') {
                $query = `
                    UPDATE ${table} 
                    SET r_name = ?,
                        r_capacity = ?,
                        r_detail = ?
                    WHERE
                        r_id = ?`;
                db.query($query, [
                    value.r_name,
                    value.r_capacity,
                    value.r_detail,
                    id
                ], (err, result) => {
                    if (err) return (err);
                    resolve(result)
                });
            } else {
                $query = `
                    UPDATE ${table}
                    SET r_name = ?,
                        r_capacity = ?,
                        r_detail = ?,
                        r_image = ?
                    WHERE
                        r_id = ?`;
                db.query($query, [
                    value.r_name,
                    value.r_capacity,
                    value.r_detail,
                    value.r_image,
                    id
                ], (err, result) => {
                    if (err) return (err);
                    resolve(result)
                });
            }
        });
    },
    // Another
    findDetailForBooking(id) {
        return new Promise((resolve, reject) => {
            db.query(`
                SELECT r_id, r_image, r_name, r_capacity, r_detail, 
                (SELECT COUNT(*) FROM tb_bookings 
                    WHERE tb_rooms_r_id = r_id AND bk_status = 'pending') AS r_booking
                FROM ${table}
                WHERE r_id = ?
            `, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result.length > 0 ? result[0] : null);
            });
        });
    }

}