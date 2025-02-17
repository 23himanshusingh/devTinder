const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isAlpha(value)) {
                throw new Error('First name must contain only alphabetic characters');
            }
        }
    },
    lastName:{
        type: String,
        trim: true,
        validate(value) {
            if (value && !validator.isAlpha(value)) {
                throw new Error('Last name must contain only alphabetic characters');
            }
        }
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim : true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password:{
        type: String,
        required: true,
        minLength: 5,
        maxLength: 1024,
    },
    age:{
        type: Number,
        min: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    gender:{
        type: String,
        lowercase: true,
        validate(value){
            if(!(['male','female','others'].includes(value))){
                throw new Error('Gender is invalid');
            }
        }
    },
    photoUrl:{
        type: String,
        default : 'https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png',
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Photo URL is invalid');
            }
        }
    },
    about:{
        type: String,
        default: 'Hey there! I am using devTinder',
        trim: true
    },
    skills:{
        type: [String],
        default: [],
        validate(value) {
            if (!Array.isArray(value)) {
                throw new Error('Skills must be an array of strings');
            }
            if (value.length > 10) {
                throw new Error('You can specify a maximum of 10 skills');
            }
        }
    },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;