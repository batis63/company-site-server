const { mongoose } = require('../db/mongoose');

let stateSchema = new mongoose.Schema({
    name: {
        type: String
    },
    cities: [
        {
            name: {
                type: String
            }
        }
    ]
});

let State = mongoose.model('state', stateSchema);

module.exports = {
    State
};
