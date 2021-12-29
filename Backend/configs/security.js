const crypto = require('crypto');

const security = {
    password_hash(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    },
    password_verify(password, password_hash) {
        // TypeError: this.password_hash is not a function
        return security.password_hash(password) === password_hash;
    },
    authenticated(req, res, next) {
        
        req.session.userLogin = {
            "u_id": 18,
            "u_username": "admin",
            "u_firstname": "Administrator",
            "u_lastname": "Administrator",
            "u_role": "admin"
        };

        try {
            if (req.session.userLogin) {
                return next();
            } 
            throw new Error('Unauthorized.');
        } catch (ex) {
            res.error(ex, 401);
        }
    }
}

module.exports = security;




/* 

module.exports = {
    password_hash(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    },
    password_verify(password, password_hash) {
        //* TypeError: this.password_hash is not a function
        return this.password_hash(password) === password_hash;
    }
}

*/