const db = require('./../configs/database');
const { password_hash, password_verify } = require('./../configs/security')

module.exports = {

    onRegister(value) {
        return new Promise((resolve, reject) => {
            value.u_password = password_hash(value.u_password);
            db.query('INSERT INTO tb_users SET ?', value, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.message || {status: 'success'}); // or -> resolve(result);
                }
            })
        })
    },
    onLogin(value) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM tb_users WHERE u_username = ?', [value.u_username], (err, result) => {
                if (err) return reject(err);
                if (result.length > 0) {
                    const userLogin = result[0];
                    if (password_verify(value.u_password, userLogin.u_password)) {
                        // don't send password or another to client
                        delete userLogin.u_password;
                        delete userLogin.u_created;
                        delete userLogin.u_updated;
                        return resolve(userLogin);
                    }
                }
                reject(new Error('Invalid Username or Password.'));
            })
        })
    }
    
}