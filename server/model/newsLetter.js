const { mongoose } = require('../db/mongoose');
const Joi = require('joi');

let newsLetterSchema = new mongoose.Schema({
    email: {
        type: String
    }
});

let NewsLetter = mongoose.model('newsletters', newsLetterSchema);

const validate = newsLetter => {
    const schema = {
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email()
    };

    return Joi.validate(newsLetter, schema);
};

module.exports = {
    NewsLetter,
    validate
};
