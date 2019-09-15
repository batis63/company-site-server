const { mongoose } = require('../db/mongoose');
const Joi = require('joi');

let blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 70,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true
    },
    userIp: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true
    },
    insertDateBlog: {
        type: Date,
        default: new Date(),
        required: true
    },
    links: [
        {
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 2,
                maxlength: 70
            },
            url: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 300
            }
        }
    ],
    tags: {
        type: String,
        required: false,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    downloadLink: {
        type: String,
        required: false,
        trim: true
    },
    isPublished: { type: Boolean, required: true, default: false },
    shortLink: { type: String, required: false, maxlength: 50 },
    comments: [
        {
            insertDateComment: {
                type: Date,
                default: new Date()
            },
            comment: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 500
            },
            email: {
                type: String,
                required: true
            },
            isPublished: {
                type: Boolean,
                required: true,
                default: false
            },
            reply: {
                type: String,
                required: false,
                maxlength: 255,
                default: ''
            },
            replyDate: {
                type: Date,
                required: false,
                default: new Date()
            },
            name: {
                type: String,
                require: true,
                trim: true,
                minlength: 2,
                maxlength: 100
            }
        }
    ],

    sections: [
        {
            content: {
                type: String,
                required: false,
                minlength: 0,
                default: ''
            },
            imageUrl: {
                type: String,
                required: false,
                maxlength: 200
            },
            order: {
                type: Number,
                required: true,
                default: 1
            },
            sectionType: {
                type: String,
                required: false,
                maxlength: 10
            }
        }
    ]
});

let Blog = mongoose.model('blogs', blogSchema);

const validate = blog => {
    const schema = {
        title: Joi.string()
            .min(2)
            .max(70)
            .required(),
        userName: Joi.string()
            .min(2)
            .max(50)
            .required(),
        userIp: Joi.string().required(),
        tags: Joi.string()
            .min(2)
            .max(500),
        downloadLink: Joi.string()
            .uri()
            .allow(''),
        shortLink: Joi.string()
            .uri()
            .allow(''),
        isPublished: Joi.bool(),
        insertDateBlog: Joi.date()
    };

    return Joi.validate(blog, schema);
};

let validateSections = section => {
    let schema = {
        content: Joi.string()
            .min(0)
            .allow(''),
        imageUrl: Joi.string()
            .uri()
            .allow(''),
        order: Joi.number().required(),
        sectionType: Joi.string().allow('')
    };
    return Joi.validate(section, schema);
};

let validateComments = comment => {
    let schema = {
        comment: Joi.string()
            .min(2)
            .max(500)
            .required(),
        email: Joi.string()
            .email()
            .required(),
        isPublished: Joi.bool().required(),
        reply: Joi.string()
            .max(255)
            .allow(''),
        replyDate: Joi.date().allow(''),
        name: Joi.string()
            .required()
            .min(2)
            .max(100),
        insertDateComment: Joi.date()
    };
    return Joi.validate(comment, schema);
};

let validateLinks = link => {
    let schema = {
        title: Joi.string()
            .min(2)
            .max(70)
            .required(),
        url: Joi.string().uri()
    };
    return Joi.validate(link, schema);
};

module.exports = {
    Blog,
    validate,
    validateSections,
    validateLinks,
    validateComments
};
