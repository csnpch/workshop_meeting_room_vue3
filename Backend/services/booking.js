const db = require('./../configs/database');
const config = require('./../configs');
const table = {
    bk: 'tb_bookings',
    bkeq: 'tb_bookings_has_tb_equipments'
};

module.exports = {

    onCreate(value) {
        return new Promise((resolve, reject) => {
            // not real insert is temp in db and error go rollback
            db.beginTransaction(tsError => {
                if (tsError) return reject(tsError);
                // save data to tb_bookings 
                let bkModel = {
                    bk_title: value.bk_title,
                    bk_detail: value.bk_detail,
                    bk_time_start: new Date(value.bk_time_start),
                    bk_time_end: new Date(value.bk_time_end),
                    tb_users_u_id: value.tb_users_u_id,
                    tb_rooms_r_id: value.tb_rooms_r_id
                };
                db.query(`INSERT INTO ${table.bk} SET ?`, bkModel, (err, bk_result) => {
                    if (err) {
                        db.rollback();
                        return reject(err);
                    }
                    // Insert data to tb_bookings_has_tb_equipments
                    let tb_bookings_bk_id = bk_result.insertId;
                    let bkeqModel = [];
                    value.equipments.forEach(tb_bookings_eq_id => bkeqModel.push([
                        tb_bookings_bk_id, tb_bookings_eq_id
                    ]));
                    db.query(`INSERT INTO ${table.bkeq} (tb_bookings_bk_id, tb_equipments_eq_id) VALUES ?`, [bkeqModel], (err, bkeq_result) => {
                        if (err) {
                            db.rollback();
                            return reject(err);
                        }
                        db.commit(cmError => {
                            if (cmError) {
                                db.rollback();
                                return reject(cmError);
                            }
                        })
                        resolve(bkeq_result);
                    })
                });
            })

        });
    },
    findHistory(value) {
        return new Promise((resolve, reject) => {
            let limitPage = config.limitPage;
            let startPage = ((value.page || 1) - 1) * limitPage;
            let sqls = {
                count: `SELECT COUNT(bk_id) as rowsCount FROM ${table.bk}`,
                select: `SELECT * FROM ${table.bk}` 
            };

            if (value.search_key && value.search_text) {
                let key = value.search_key;
                let txt = value.search_text;
                let sqlSearch = ` WHERE ${db.escapeId(key)} LIKE ${db.escape(`%${txt}%`)}`;
                sqls.count += sqlSearch;
                sqls.select += sqlSearch;
            }

            // find row data
            db.query(sqls.count, (err, result) => {
                if (err) return reject(err);
                let items = { result: [], rows: result[0].rowsCount, limit: limitPage }

                // set list page
                sqls.select += ` ORDER BY bk_created DESC LIMIT ${db.escape(startPage)}, ${limitPage}`;
                db.query(sqls.select, (err, result) => {
                    items.result = result
                    if (err) return reject(err);
                    resolve(items);
                });

            });
        });
    }

};