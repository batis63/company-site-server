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
    tags: [String],
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
                minlength: 5,
                maxlength: 50
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
        userIp: Joi.string().required()
    };

    return Joi.validate(blog, schema);
};

let validateSections = section => {
    let schema = {
        content: Joi.string()
            .min(10)
            .required(),
        imageUrl: Joi.string().uri(),
        order: Joi.number().required()
    };
    return Joi.validate(section, schema);
};

let validateLinks = section => {
    let schema = {
        title: Joi.string()
            .min(2)
            .max(50)
            .required(),
        url: Joi.string().uri()
    };
    return Joi.validate(section, schema);
};

module.exports = {
    Blog,
    validate,
    validateSections
};
