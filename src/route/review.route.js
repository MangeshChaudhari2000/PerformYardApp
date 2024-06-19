import express from 'express';
import mongoose from 'mongoose';
import jwtAuth from '../middleware/jwtAuth.middleware.js';

import ReviewController from '../controller/review.controller.js';

const reviewController = new ReviewController();


const reviewRouter = express.Router();


reviewRouter.get('/', jwtAuth, (req, res) => {
    return res.render('manageReview', { userDetails: "" }); 
});

reviewRouter.get('/feedbackreceived', jwtAuth, (req, res) => {
    reviewController.getFeedback(req, res)
});

reviewRouter.get('/viewRecipient/:reviewerId', jwtAuth, (req, res) => {
    reviewController.viewRecipient(req, res)
});

reviewRouter.get('/removeRecepient/:recipientId/:reviewerId', jwtAuth, (req, res) => {
    reviewController.removeRecepient(req, res)
});

reviewRouter.post('/searchForPermormance', jwtAuth, (req, res) => {
    reviewController.searchUser(req, res)
});

reviewRouter.post('/addRecipient/:id',jwtAuth, (req, res) => {
    reviewController.addRecipient(req,res);
});

reviewRouter.get('/feedback',jwtAuth, (req, res) => {
    reviewController.getFeedbackInput(req,res);
});

reviewRouter.post('/addFeedback/:recipientId',jwtAuth, (req, res) => {
    reviewController.addFeedback(req,res);
});






export default reviewRouter;
