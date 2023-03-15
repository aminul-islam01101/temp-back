/* eslint-disable new-cap */
const mongoose = require('mongoose');
const allValidator = require('validator');

const remoforceSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide User name'],
    },

    // email: {
    //     type: String,
    //     required: [true, 'Please provide a unique email'],
    //     unique: true,
    // },

    // personalPhone: {
    //     type: Number,
    //     required: [true, 'Please provide a valid phone number'],
    // },
    personalPhone: {
        type: String,
        // required: true,
        trim: true,
        validate: {
            validator: allValidator.isMobilePhone,
            message: (props) => `${props.value} is not valid mobile number`,
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,

        validate: {
            validator: allValidator.isEmail,
            message: (props) => `${props.value} is not valid i.e. not like example@example.com`,
        },
        trim: true,
    },
    // update profile settings

    personalDetails: {
        bio: {
            type: String,
        },
        aboutMe: {
            type: String,
        },
        age: {
            type: Number,
        },
        gender: {
            type: String,
        },
        birthDate: {
            type: Date,
        },
        alternativeEmail: {
            type: String,

            validate: {
                validator: allValidator.isEmail,
                message: (props) => `${props.value} is not valid i.e. not like example@example.com`,
            },
            trim: true,
        },
        alternativePhone: {
            type: String,
            // required: true,
            trim: true,
            validate: {
                validator: allValidator.isMobilePhone,
                message: (props) => `${props.value} is not valid mobile number`,
            },
        },
    },
    socialLinks: {
        Github: String,
        Linkedin: String,
        Instagram: String,
        Twitter: String,
    },

    remoforceProfilePhoto: {
        type: String,
    },
    resume: {
        type: String,
    },

    createdOn: {
        type: Date,
        default: Date.now,
    },
});
const User = new mongoose.model('remoforce', remoforceSchema);

module.exports = User;
