//const validator = require('validator');
const Joi = require('joi');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const { mongoose } = require('./../db/mongoose');
const emailMain = process.env.EMAIL;
const pass = process.env.EMAIL_PASSWORD;
const path = require('path');

let userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 70
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 70
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
    reset_password_token: {
        type: String,
        required: false,
        trim: true
    },
    reset_password_expires: {
        type: Date,
        required: false
    },
    addresses: [
        {
            province_name: {
                type: String,
                trim: true,
                required: false,
                minlength: 2,
                maxlength: 100
            },
            city_name: {
                type: String,
                trim: true,
                required: false,
                minlength: 2,
                maxlength: 100
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
                trim: true,
                maxlength: 10
            },
            receiver_mobile: {
                type: String,
                required: true,
                trim: true,
                maxlength: 11,
                minlength: 11
            },
            receiver_first_name: {
                type: String,
                required: true,
                trim: true,
                minlength: 2,
                maxlength: 70
            },
            receiver_last_name: {
                type: String,
                required: true,
                trim: true,
                minlength: 2,
                maxlength: 70
            }
        }
    ],
    tel: {
        type: String,
        trim: true,

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

const validateAddress = model => {
    const schema = {
        province_name: Joi.string()
            .required()
            .min(2)
            .max(100),
        city_name: Joi.string()
            .required()
            .min(2)
            .max(100),
        address: Joi.string()
            .required()
            .min(2)
            .max(255),
        postal_code: Joi.string()
            .max(10)
            .allow(''),
        receiver_mobile: Joi.string()
            .required()
            .min(11)
            .max(11),
        receiver_first_name: Joi.string()
            .required()
            .min(2)
            .max(70),
        receiver_last_name: Joi.string()
            .required()
            .min(2)
            .max(70)
    };
    return Joi.validate(model, schema);
};

const validateEmail = model => {
    const schema = {
        email: Joi.string()
            .required()
            .min(3)
            .max(255)
            .email()
    };
    return Joi.validate(model, schema);
};

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

const validatePasswordWhenReset = user => {
    const schema = {
        newPassword: Joi.string()
            .min(5)
            .max(30)
            .required()
    };

    return Joi.validate(user, schema);
};

const sendForgotEmail = user => {
    var transporter = nodemailer.createTransport({
        host: 'mail.mizbanplast.ir',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: emailMain,
            pass
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });

    var handlebarsOptions = {
        viewEngine: {
            extName: '.handlebars',
            partialsDir: path.resolve(__dirname, '../templates'),
            layoutsDir: path.resolve(__dirname, '../templates'),
            defaultLayout: 'forgot-password-email.handlebars'
        },
        //viewEngine: 'handlebars',
        viewPath: path.resolve(__dirname, '../templates'),
        extName: '.handlebars'
    };

    transporter.use('compile', hbs(handlebarsOptions));

    const token = jwt.sign(
        { _id: user._id.toHexString() },
        process.env.JWT_SECRET_FORGOT_PASSWORD
    );

    var mailOptions = {
        from: emailMain,
        to: user.email,
        template: 'forgot-password-email',
        subject: 'بازیابی رمز عبور',
        context: {
            url: `${process.env.PUBLIC_URL}/resetpassword?token=` + token,
            name: user.first_name,
            publicurl: 'https://api.mizbanplast.ir/images/logo.png'
        }
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            var date = new Date();
            user.reset_password_token = token;
            user.reset_password_expires = date.setDate(date.getDate() + 7);
            user.save();
            console.log(
                'Email sent: ' + info.response + user.email + mailOptions.to
            );
        }
    });
};

const sendChangePasswordEmail = user => {
    var transporter = nodemailer.createTransport({
        host: 'mail.mizbanplast.ir',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: emailMain,
            pass
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });

    var handlebarsOptions = {
        viewEngine: {
            extName: '.handlebars',
            partialsDir: path.resolve(__dirname, '../templates'),
            layoutsDir: path.resolve(__dirname, '../templates'),
            defaultLayout: 'reset-password-email.handlebars'
        },
        viewPath: path.resolve(__dirname, '../templates'),
        extName: '.handlebars'
    };

    transporter.use('compile', hbs(handlebarsOptions));

    var mailOptions = {
        from: emailMain,
        to: user.email,
        template: 'reset-password-email',
        subject: 'تغییر کلمه عبور',
        context: {
            name: user.first_name,
            publicurl: 'https://api.mizbanplast.ir/images/logo.png'
        }
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log(
                'Email sent: ' + info.response + user.email + mailOptions.to
            );
        }
    });
};

const sendSignUpEmail = user => {
    var transporter = nodemailer.createTransport({
        host: 'mail.mizbanplast.ir',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: emailMain,
            pass
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });

    var handlebarsOptions = {
        viewEngine: {
            extName: '.handlebars',
            partialsDir: path.resolve(__dirname, '../templates'),
            layoutsDir: path.resolve(__dirname, '../templates'),
            defaultLayout: 'signup-user.handlebars'
        },
        //viewEngine: 'handlebars',
        viewPath: path.resolve(__dirname, '../templates'),
        extName: '.handlebars'
    };

    transporter.use('compile', hbs(handlebarsOptions));

    var mailOptions = {
        from: emailMain,
        to: user.email,
        bcc: 'support@mizbanplast.ir',
        template: 'signup-user',
        subject: 'ثبت نام کاربر جدید',
        context: {
            name: user.first_name,
            publicurl: 'https://api.mizbanplast.ir/images/logo.png'
        }
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log(
                'Email sent: ' + info.response + user.email + mailOptions.to
            );
        }
    });
};

const sendEditInformationEmail = user => {
    var transporter = nodemailer.createTransport({
        host: 'mail.mizbanplast.ir',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: emailMain,
            pass
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });

    var handlebarsOptions = {
        viewEngine: {
            extName: '.handlebars',
            partialsDir: path.resolve(__dirname, '../templates'),
            layoutsDir: path.resolve(__dirname, '../templates'),
            defaultLayout: 'edit-information.handlebars'
        },
        //viewEngine: 'handlebars',
        viewPath: path.resolve(__dirname, '../templates'),
        extName: '.handlebars'
    };

    transporter.use('compile', hbs(handlebarsOptions));

    var mailOptions = {
        from: emailMain,
        to: user.email,
        template: 'edit-information',
        subject: 'ویرایش اطلاعات کاربری',
        context: {
            name: user.first_name,
            publicurl: 'https://api.mizbanplast.ir/images/logo.png'
        }
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log(
                'Email sent: ' + info.response + user.email + mailOptions.to
            );
        }
    });
};

const validate = user => {
    const schema = {
        last_name: Joi.string()
            .min(2)
            .max(70)
            .required(),
        first_name: Joi.string()
            .min(2)
            .max(70)
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
            .max(11)
            .allow(''),
        mobile: Joi.string()
            .min(11)
            .max(11)
            .required()
    };

    return Joi.validate(user, schema);
};

const validateWhenEdit = user => {
    const schema = {
        last_name: Joi.string()
            .min(2)
            .max(70)
            .required(),
        first_name: Joi.string()
            .min(2)
            .max(70)
            .required(),

        email: Joi.string()
            .min(5)
            .max(255)
            .email()
            .required(),
        tel: Joi.string()
            .max(11)
            .allow(''),
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

    return _.pick(userObject, [
        '_id',
        'first_name',
        'last_name',
        'email',
        'tel',
        'mobile',
        'addresses',
        'user_type'
    ]);
};

userSchema.statics.findByToken = async function(token) {
    let User = this;
    let decoded = jwt.verify(token, process.env.JWT_SECRET);

    try {
        let user = await User.findOne({
            _id: decoded._id,
            token_key: token
        });
        return user;
    } catch (error) {
        return Promise.reject();
    }
};

userSchema.methods.generateAuthToken = function() {
    let user = this;
    const token = jwt.sign(
        { _id: user._id.toHexString() },
        process.env.JWT_SECRET
    );

    user.token_key = token;
    return user.save().then(() => {
        return token;
    });
};

let User = mongoose.model('User', userSchema);

module.exports = {
    User,
    validate,
    validatePassword,
    validateEmail,
    sendForgotEmail,
    validatePasswordWhenReset,
    validateWhenEdit,
    validateAddress,
    sendChangePasswordEmail,
    sendEditInformationEmail,
    sendSignUpEmail
};
