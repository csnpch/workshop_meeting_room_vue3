const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');

const server = express();
const PORT = process.env.SERVER_PORT || 3000;


//! Check req route anonymous
// server.get('*', (req, res) => {
server.get('/', (req, res) => {
    res.end(`<h1>Server is running!</h1>`);
});


//! setting session for system
server.use(expressSession({
    secret: 'keyboard cat, Hello what that!!',
    resave: false,
    saveUninitialized: true,
    cookie: { }
}))


//! Setting Parse variable when Client req
server.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
server.use(bodyParser.json({limit: "50mb"}));
server.use(bodyParser.json()); // or {{express_variable_name}}.json() => server.use(server.json())


//! Allow content
server.use('/api/uploads', express.static(`${__dirname}/uploads/equipments`));
server.use('/api/uploads', express.static(`${__dirname}/uploads/rooms`));
// server.use(express.static(__dirname));


//! Create custom function
server.use(require('./configs/middleware'));


//! Call routes
server.use('/api', require('./routes'));



server.listen(PORT, () => console.log(`Server is started. PORT=${PORT}.`));