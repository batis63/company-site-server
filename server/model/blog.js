const { mongoose } = require('../db/mongoose');
const Joi = require('joi');

let blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true
    },
    userName: {
        type: Date,
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
            .max(50)
            .required(),
        userName: Joi.string()
            .min(2)
            .max(50)
            .required(),
        userIp: Joi.min(2)
            .max(50)
            .required()
            .ip()
    };

    return Joi.validate(blog, schema);
};

let validateSections = section => {
    let schema = {
        section: Joi.object().keys({
            content: Joi.string()
                .min(10)
                .required(),
            imageUrl: Joi.min(5)
                .max(50)
                .uri(),
            order: Joi.number().required()
        })
    };
    return Joi.validate(section, schema);
};

module.exports = {
    Blog,
    validate,
    validateSections
};
