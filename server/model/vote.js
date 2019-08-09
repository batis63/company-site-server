const { mongoose } = require('../db/mongoose');
const Joi = require('joi');

let voteSchema = new mongoose.Schema({
    email: {
        type: String
    },
    vote: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    insertDateVote: {
        type: Date,
        default: new Date()
    }
});

let Vote = mongoose.model('votes', voteSchema);

const validate = vote => {
    const schema = {
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email(),
        vote: Joi.string()
            .min(5)
            .max(1500)
            .required(),
        title: Joi.string()
            .min(3)
            .max(250)
            .required()
    };

    return Joi.validate(vote, schema);
};

module.exports = {
    Vote,
    validate
};
