const express = require('express');
const app = express();

app.use('/', express.static('public'));

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const errorHandler = require('errorhandler');
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(errorHandler());
app.use(morgan('dev'));
app.use(bodyParser.json());

module.exports = app;

const PORT = process.env.PORT || 4000;

const apiRouter = require('./api/api.js');
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log("Server is listening on PORT: "+ PORT);
});



