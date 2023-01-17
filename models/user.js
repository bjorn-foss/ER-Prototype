const mongoose = require('./mongooseConfigs').mongoose;

//Set the schema
const userSchema = new mongoose.Schema({
    username: String, password: String
});

//Set the behaviour
userSchema.methods.verifyPassword = function (password) {
    return password === this.password;
}

//Compile the schema into a models
const User = mongoose.model('User', userSchema);

function createUser(userData, cb) {
    const user = new User(userData);
    //Equivalently as the previous lines, mongoose allows the .then .catch mechanism instead of the callbacks (very similar to JS promises)
    user.save()
        .then(doc => cb(doc))
        .catch(err => cb(null, err)); //In this case the callback signature should be changed to include the err parameter
}

module.exports = {
    createUser, User
}