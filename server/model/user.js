//const validator = require('validator');
const Joi = require('joi');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { mongoose } = require('./../db/mongoose');
const config = require('config');
const bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 1024
    },
    user_type: {
        type: String,
        required: true,
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    token_key: {
        type: String,
        required: false,
        trim: true
    },
    addresses: [
        {
            address_data: {
                _id: false,
                province_name: {
                    type: String,
                    trim: true,
                    required: false
                },
                city_name: {
                    type: String,
                    trim: true,
                    required: false
                },
                address: {
                    type: String,
                    trim: true,
                    minlength: 5,
                    maxlength: 255,
                    required: false
                },
                postal_code: {
                    type: String,
                    required: false,
                    trim: true
                }
            }
        }
    ],
    tel: {
        type: String,
        trim: true,
        minlength: 11,
        maxlength: 11,
        required: false
    },
    mobile: {
        type: String,
        trim: true,
        minlength: 11,
        maxlength: 11,
        required: true
    }
});

const validatePassword = user => {
    const schema = {
        password: Joi.string()
            .min(5)
            .max(30)
            .required(),
        newPassword: Joi.string()
            .min(5)
            .max(30)
            .required()
    };

    return Joi.validate(user, schema);
};

const sendMail = (type,user) => {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'najafianmorteza@gmail.com',
            pass: 'Niloofar1026911'
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    let html = '';

    switch (type) {
        case 'signup':
            html = `<h1>کاربر گرامی  ثبت نام شما با موفقیت انجام شد</h1>`;
            break;

        case 'changepassword':
            html = `<h1>کاربر گرامی تغییر رمز شما با موفقیت انجام شد</h1>`;
            break;
        default:
            break;
    }
    var mailOptions = {
        from: 'najafianmorteza@gmail.com',
        to: user.email,
        subject: 'به سایت ما خوش آمدید',
        html: html,
        attachments: [
            {
                // filename and content type is derived from path
                filename: 'img1.jpg',
                path: 'http://localhost:4000/images/img1.jpg'
            }
        ]
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

const validate = user => {
    const schema = {
        last_name: Joi.string()
            .min(5)
            .max(255)
            .required(),
        first_name: Joi.string()
            .min(5)
            .max(255)
            .required(),
        password: Joi.string()
            .min(5)
            .max(30)
            .required(),
        email: Joi.string()
            .min(5)
            .max(255)
            .email()
            .required(),
        tel: Joi.string()
            .min(11)
            .max(11),
        mobile: Joi.string()
            .min(11)
            .max(11)
            .required()
    };

    return Joi.validate(user, schema);
};

//جهت ارسال اطلاعاتی که باید برگشت داده شود
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'first_name', 'last_name', 'email']);
};

userSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, config.get('JWT_SECRET'));
    } catch (e) {
        return Promise.reject();
    }

    let user = User.findOne({
        _id: decoded._id,
        token_key: token
    });
    if (!user) {
        return Promise.reject();
    }
    return user;
};

userSchema.methods.generateAuthToken = function() {
    let user = this;
    const token = jwt.sign(
        { _id: user._id.toHexString() },
        config.get('JWT_SECRET')
    );

    user.token_key = token;
    return user.save().then(() => {
        return token;
    });
};

// userSchema.pre('save', function(next) {
//     let user = this;

//     next();
// });

let User = mongoose.model('User', userSchema);

module.exports = {
    User,
    validate,
    validatePassword,
    sendMail
};
