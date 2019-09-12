const { mongoose } = require('../db/mongoose');
const Joi = require('joi');

let shortLinkSchema = new mongoose.Schema({
    mainLink: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        trim: true
    },
    shortLink: {
        type: String,
        minlength: 1,
        maxlength: 10,
        required: true,
        trim: true
    }
});

let ShortLink = mongoose.model('shortLinks', shortLinkSchema);

const validate = shortLink => {
    const schema = {
        mainLink: Joi.string()
            .min(5)
            .max(255)
            .required()
            .uri(),
        shortLink: Joi.string()
            .min(1)
            .max(10)
            .required()
    };

    return Joi.validate(shortLink, schema);
};

module.exports = {
    ShortLink,
    validate
};
