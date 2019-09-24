const Joi = require('joi');

const { mongoose } = require('./../db/mongoose');

let productCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false
    }
});

const validate = productCategory => {
    const schema = {
        name: Joi.string()
            .required()
            .min(2)
            .max(20),
        isPublished: Joi.bool().required()
    };

    return Joi.validate(productCategory, schema);
};

let ProductCategory = mongoose.model(
    'ProductCategories',
    productCategorySchema
);

module.exports = {
    ProductCategory,
    validate
};
