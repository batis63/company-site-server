const mongoose = require('mongoose');
const fs = require('fs');

mongoose.Promise = global.Promise;
mongoose
    .connect(process.env.MONGOURI, {
        useNewUrlParser: true,
        useFindAndModify: false
    }).then(()=>{
        fs.writeFile('message.txt', 'connected success', (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          });
    }).catch(ex=>{
        fs.writeFile('error.txt', 'connected un success', (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          });
    });
module.exports = {
    mongoose
};
