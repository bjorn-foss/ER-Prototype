const mongoose = require('mongoose');
require('dotenv/config');

mongoose.connect(process.env.DB_CONNECTION)
    .then(() => console.log('MongoDB is connected.'))
    .catch(() => console.log('MongoDB is NOT connected.'));

exports.mongoose = mongoose;
