import mongoose from "mongoose";
import express from "express";
import bcrypt from 'bcryptjs';


import { UserModel } from "../schema/user.schema.js";
import { FeedbackModel } from "../schema/feedback.schema.js";
import ApplicationError from "../../service/application.errorHandler.js";

export default class ReviewRepository {


    getFeedback = async (userId) => {
        try {
            const reviewerDetails = await UserModel.findById(userId);
            const feedBackId = reviewerDetails.feedbackReceived;
            const feedbackArray = [];
            if (feedBackId == "") {
                return "";
            }
            if (feedBackId.length > 1) {

                await Promise.all(
                    feedBackId.map(async (element) => {
                        const feedbackdetails = await FeedbackModel.findById(element);
                        if (feedbackdetails) {
                            const reviewerDetails = await UserModel.findById(feedbackdetails.reviewer)
                            const tempObj = {
                                _id: feedbackdetails._id,
                                comment: feedbackdetails.comment,
                                reviewerFirstName: reviewerDetails.firstName,
                                reviewerLastName: reviewerDetails.lastName,
                                reviewerEmailId: reviewerDetails.emailId,
                                rating: feedbackdetails.rating
                            }
                            feedbackArray.push(tempObj);
                        }
                    }))

                return feedbackArray;
            } else {
                const feedbackdetails = await FeedbackModel.findById(feedBackId);
                if (feedbackdetails) {
                    const reviewerDetails = await UserModel.findById(feedbackdetails.reviewer)
                    const tempObj = {
                        _id: feedbackdetails._id,
                        comment: feedbackdetails.comment,
                        reviewerFirstName: reviewerDetails.firstName,
                        reviewerLastName: reviewerDetails.lastName,
                        reviewerEmailId: reviewerDetails.emailId,
                        rating: feedbackdetails.rating
                    }
                    feedbackArray.push(tempObj);
                }
                return feedbackArray;
            }
        } catch (error) {
            throw new ApplicationError(error.message, 400);

        }

    }

    getRecepient = async (userId) => {
        try {
            const reviewerDetails = await UserModel.findById(userId);
            const recepientId = reviewerDetails.reviewAssigned;
            const recepientIdArray = [];
            if (recepientId.length == 0) {
                return "";
            }
            if (recepientId.length > 1) {
                recepientId.forEach(async (element) => {

                    const recipientDetails = await UserModel.findById(element);
                    const newRecipient = {
                        recepientId: recipientDetails._id,
                        recipientEmailId: recipientDetails.emailId,
                        recepientfirstName: recipientDetails.firstName,
                        recepientlastName: recipientDetails.lastName,
                        recepientPhoneNo: recipientDetails.phoneNo
                    };
                    await recepientIdArray.push(newRecipient);
                });

                return recepientIdArray;

            } else {
                const recipientDetails = await UserModel.findById(recepientId);
                const newRecipient = {
                    recepientId: recipientDetails._id,
                    recipientEmailId: recipientDetails.emailId,
                    recepientfirstName: recipientDetails.firstName,
                    recepientlastName: recipientDetails.lastName,
                    recepientPhoneNo: recipientDetails.phoneNo
                };
                recepientIdArray.push(newRecipient);
                return recepientIdArray;
            }
        } catch (error) {
            throw new ApplicationError(error.message, 400);

        }

    }

    getFeedbacktoAdd = async (reviewerId, recipentArray) => {
        try {
            const recepientIdArray = [];

            if (recipentArray == 0) {
                return "";
            }
            if (recipentArray.length > 1) {
                await Promise.all(
                    recipentArray.map(async (element) => {
                        const feedBackDetails = await FeedbackModel.findOne({ reviewer: reviewerId, recipient: element });
                        if (!feedBackDetails) {
                            const recipientDetails = await UserModel.findById(element);
                            const newRecipient = {
                                recepientId: recipientDetails._id,
                                recipientEmailId: recipientDetails.emailId,
                                recepientfirstName: recipientDetails.firstName,
                                recepientlastName: recipientDetails.lastName,
                                recepientPhoneNo: recipientDetails.phoneNo
                            };
                            recepientIdArray.push(newRecipient);
                        }
                    })
                );
                return recepientIdArray;

            }


            else {
                const recipientDetails = await UserModel.findById(recipentArray);
                const feedBackDetails = await FeedbackModel.findOne({ reviewer: reviewerId, recipient: recipentArray })
                if (!feedBackDetails) {
                    const newRecipient = {
                        recepientId: recipientDetails._id,
                        recipientEmailId: recipientDetails.emailId,
                        recepientfirstName: recipientDetails.firstName,
                        recepientlastName: recipientDetails.lastName,
                        recepientPhoneNo: recipientDetails.phoneNo
                    };
                    recepientIdArray.push(newRecipient);
                }

                return recepientIdArray;
            }
        } catch (error) {
            throw new ApplicationError(error.message, 400);

        }

    }

    addFeedback = async (reviewerId, recipientId, comment, rating) => {
        try {
            // Create a new FeedbackModel instance
            const feedback = new FeedbackModel({
                comment: comment,
                rating: rating,
                reviewer: reviewerId,
                recipient: recipientId
            });

            // Save the feedback
            const savedFeedback = await feedback.save();

            // If feedback is saved successfully, update the recipient's feedbackReceived array
            if (savedFeedback) {
                // Find the recipient user and update feedbackReceived array
                const recipient = await UserModel.findById(recipientId);
                if (recipient) {
                    recipient.feedbackReceived.push(savedFeedback._id); // Push new feedback _id to array
                    await recipient.save(); // Save the recipient to update the database
                }

                return savedFeedback; // Return the saved feedback object
            }
        } catch (error) {
            throw new ApplicationError(error.message, 400); // Handle errors appropriately
        }
    };

    removeRecepientRepo = async (reviewerId, recepientId) => {
        try {
            const reviewerDetails = await UserModel.findById(reviewerId);

            if (reviewerDetails.reviewAssigned.length > 1) {
                await Promise.all(
                    reviewerDetails.reviewAssigned.map(async (element, index) => {
                        if (element == recepientId) {
                            reviewerDetails.reviewAssigned.splice(index, 1); // Remove element from array
                        }
                    })
                );

                const isRmoved = await reviewerDetails.save();
                return isRmoved; // Return the saved reviewerDetails
            } else {
                reviewerDetails.reviewAssigned = [];
                const isRmoved = await reviewerDetails.save();
                return isRmoved; // Return the saved reviewerDetails
            }
        } catch (error) {
            throw new ApplicationError(error.message, 400);
        }
    }



}