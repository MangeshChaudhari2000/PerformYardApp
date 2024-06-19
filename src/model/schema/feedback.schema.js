import mongoose from "mongoose";
import express from 'express';

const feedbackSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
        required: true  
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
}
)

export const FeedbackModel = mongoose.model('Feedback', feedbackSchema);

