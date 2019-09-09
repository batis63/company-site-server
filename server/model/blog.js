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
                maxlength: 50
            },
            url: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
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
    sections: [
        {
            content: {
                type: String,
                required: true,
                minlength: 10
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
            .max(50),
        downloadLink: Joi.string().uri()
    };

    return Joi.validate(blog, schema);
};

let validateSections = section => {
    let schema = {
        content: Joi.string()
            .min(10)
            .required(),
        imageUrl: Joi.string()
            .uri()
            .allow(''),
        order: Joi.number().required()
    };
    return Joi.validate(section, schema);
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
    validateLinks
};
