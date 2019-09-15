//---Config
const dotenv = require('dotenv');
dotenv.config();
const crypto = require('crypto');
var cors = require('cors');
const cookieParser = require('cookie-parser');
const { join } = require('path');
const express = require('express');
const helmet = require('helmet');
const products = require('./routes/products');
const login = require('./routes/login');
const users = require('./routes/users');
const votes = require('./routes/votes');
const newsletter = require('./routes/newsletters');
const states = require('./routes/states');
const blogs = require('./routes/blogs');
const shortLinks = require('./routes/shortLinks');
const files = require('./routes/files');
const requestIp = require('request-ip');
const app = express();
const publicImages = express.static(join(__dirname, './images'));
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(requestIp.mw());
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
        }
    })
);
app.set('view engine', 'html');
app.use('/api/products', products);
app.use('/api/users', users);
app.use('/api/votes', votes);
app.use('/api/blogs', blogs);
app.use('/api/shortlinks', shortLinks);
app.use('/api/files', files);
app.use('/api/newsletter', newsletter);
app.use('/api/states', states);
app.use('/images', publicImages);
app.use('/api/login', login);

process.env.sessionID = crypto.randomBytes(32).toString('base64');

app.listen(process.env.SERVERPORT, () => {
    //logger.info(`Server running on port ${config.get('PORT')}`);
    console.log(`${process.env.SERVERPORT}`);
});
