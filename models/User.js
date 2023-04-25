var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
var secret = process.env.SECRET_KEY

require('../utils/database')

var UserSchema = new mongoose.Schema({
    username: { type: String, lowercase: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true },
    email: { type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
    firstName: String,
    lastName: String,
    password: String,
    profilePic: String,
    resume: String,
    profilePics: [{
        type: String
    }]
}, {
    timestamps: true
});

UserSchema.methods.setPassword = async function (password) {
    this.password = await bcrypt.hash(password, bcrypt.genSaltSync(8))
    return this;
};

UserSchema.methods.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
};

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });


UserSchema.statics.findByUserName = function (username, cb) {
    return this.find({ username: username }, cb);
};

UserSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

UserSchema.methods.toAuthJSON = function () {
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
        firstName: this.firstName,
        lastName: this.lastName
    };
};

var User = mongoose.model('User', UserSchema);

module.exports = {
    "User": User,
    "UserSchema": UserSchema
}