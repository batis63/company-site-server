//const validator = require('validator');
const Joi = require('joi');
var nodemailer = require('nodemailer');
const { mongoose } = require('./../db/mongoose');

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
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 30
    },
    user_type: {
        type: String,
        required: true,
        default: 'user'
    },
    email: {
        type: String,
        required: false,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    token: {
        _id: false,
        token_key: {
            type: String,
            trim: true,
            required: false
        },
        token_expire: {
            type: Date
        }
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

const validate = user => {
    const schema = {
        username: Joi.string()
            .min(5)
            .max(255)
            .required(),
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
            .max(255)
            .required(),
        email: Joi.string()
            .min(5)
            .max(255)
            .email(),
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

userSchema.pre('save', function(next) {
    let user = this;
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

    var mailOptions = {
        from: 'najafianmorteza@gmail.com',
        to: user.email,
        subject: 'به سایت ما خوش آمدید',
        html: `<h1>کاربر گرامی ${
            user.first_name
        } ثبت نام شما با موفقیت انجام شد</h1>`,
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
    next();
});

let User = mongoose.model('User', userSchema);

module.exports = {
    User,
    validate
};
