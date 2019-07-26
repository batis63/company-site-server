//---Config
process.env.NODE_CONFIG_DIR = __dirname + '/config';
const { join } = require('path');
const config = require('config');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const winston = require('winston');
const _ = require('lodash');
const Joi = require('joi');
const products = require('./routes/products');
const login = require('./routes/login');
const users = require('./routes/users');
const states = require('./routes/states');
const app = express();
const publicImages = express.static(join(__dirname, './images'));

app.use(express.json());
app.use(helmet());
app.set('view engine', 'html');
app.use('/api/products', products);
app.use('/api/users', users);
app.use('/api/states', states);
app.use('/images', publicImages);
app.use('/api/login', login);


app.listen(config.get('PORT'), () => {
    //logger.info(`Server running on port ${config.get('PORT')}`);
    console.log(`${config.get('PORT')}`);
});
