import mongoose from "mongoose";
import express from 'express';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: [true,"emaild already exist"]
        
    },
    password: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v.toString());
            },
            message: props => `${props.value} is not a valid phone number! Must be exactly 10 digits.`,
        },
    },
    role: {
        type: String,
        enum:["Employee","Admin"],
        required: true
    },
    reviewAssigned: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    feedbackReceived: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Feedback'
        }
    ]
}, {
    timestamps: true
}
)


export const UserModel = mongoose.model('User', userSchema);


