const UserModel = require('../models/user');

//we take care of the request here not in the route, i.e. req.body.message is here, this is the job of the controller, take care of requests
function insert(req, callback) {
    UserModel.createUser({username: req.body.username, password: req.body.password}, callback);
}

module.exports = {
    insert
}
