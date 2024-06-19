import express from 'express';
import jwt from 'jsonwebtoken';

import UserRepository from '../model/repository/user.repository.js';
import ReviewRepository from '../model/repository/review.repository.js';
import { FeedbackModel } from '../model/schema/feedback.schema.js';


export default class ReviewController {

    constructor() {
        this.userRepository = new UserRepository();
        this.reviewRepository = new ReviewRepository();
    }

    searchUser = async (req, res) => {
        try {
            const userDetails = await this.userRepository.findUserbyEmail(req.body.emailId)
            if (userDetails) {
                return res.render("manageReview", { userDetails: userDetails, recipientDetails: "", feedBackDetails: "", flash: req.flash() })
            } else {
                req.flash('error', "No user found")
                return res.render("manageReview", { userDetails: '', recipientDetails: "", feedBackDetails: "", flash: req.flash() })
            }
        } catch (error) {
            req.flash('error', error.message)
            return res.render('manageReview', { userDetails: '', recipientDetails: "", feedBackDetails: "", flash: req.flash() })
        }

    }

    addRecipient = async (req, res) => {
        const recipientEmailId = req.body.recipientMailId;
        const reviwerId = req.params.id;
        try {
            const isAdded = await this.userRepository.addRecipient(recipientEmailId, reviwerId);
            if (isAdded) {
                req.flash('success', "Recipient assigned")
                return res.render("manageReview", { userDetails: isAdded, recipientDetails: "", feedBackDetails: "", flash: req.flash() })
            }
        } catch (error) {
            req.flash('error', error.message)
            return res.render("manageReview", { userDetails: "", recipientDetails: "", feedBackDetails: "", flash: req.flash() })

        }

    }

    getFeedback = async (req, res) => {
        try {
            const reviewerId = req.session.data._id;
            const feedBack = await this.reviewRepository.getFeedback(reviewerId)
            const userDetails = await this.userRepository.findUserbyUserId(reviewerId)

            if (feedBack) {
                return res.render("employeeFeedback", {  feedBackDetails: feedBack, flash: req.flash() })
            } else {
                return res.render("employeeFeedback", { feedBackDetails: "", flash: req.flash() })
            }
        } catch (error) {
            req.flash('error', error.message)
            return res.render('employeeFeedback', { feedBackDetails: "", flash: req.flash() })
        }

    }

    viewRecipient = async (req, res) => {
        try {
            const reviewerId = req.params.reviewerId;
            const getRecepient = await this.reviewRepository.getRecepient(reviewerId)
            const userDetails = await this.userRepository.findUserbyUserId(reviewerId)

            if (getRecepient) {
                return res.render("manageReview", { userDetails: userDetails, recipientDetails: getRecepient, feedBackDetails: "", flash: req.flash() })
            } else {
                req.flash('error', "No recipient Assigned")
                return res.render("manageReview", { userDetails: userDetails, recipientDetails: "", feedBackDetails: "", flash: req.flash() })
            }
        } catch (error) {
            req.flash('error', error.message)
            return res.render('manageReview', { userDetails: "", recipientDetails: "", feedBackDetails: "", flash: req.flash() })
        }


    }

    getFeedbackInput = async(req,res)=>{
        try {
            const reviewAssignedArray=req.session.data.reviewAssigned;
            const getRecepient = await this.reviewRepository.getFeedbacktoAdd(req.session.data._id,reviewAssignedArray)

            if (getRecepient) {
                return res.render("employeeReview", { recipientDetails: getRecepient })
            } else {
                return res.render("employeeReview", { recipientDetails: "" })
            }
        } catch (error) {
            req.flash('error', error.message)
            return res.render('employeeReview', { recipientDetails: "", feedBackDetails: "", flash: req.flash() })
        }
    }


    addFeedback= async(req,res)=>{
        try {
            const reviewerId=req.session.data._id;
            const recipientId=req.params.recipientId;
            const isFeedbackAdded = await this.reviewRepository.addFeedback(reviewerId,recipientId,req.body.comment,req.body.rating);

            if (isFeedbackAdded) {
                res.locals.flash=req.flash("success","feedback added successfully");
                return res.redirect("back")
            } 
        } catch (error) {
            req.flash('error', error.message)
            return res.render('employeeReview', { recipientDetails: "", feedBackDetails: "", flash: req.flash() })
        }
    }

    // below incomplee
    removeRecepient = async(req,res)=>{

        try {
            const recipientId= req.params.recipientId;
            const reviewerId= req.params.reviewerId;
    
            const isRecipientRemoved=await this.reviewRepository.removeRecepientRepo(reviewerId,recipientId);
            if (isRecipientRemoved) {

                res.locals.flash=req.flash("success","Unassigned recipient successfully");
                return res.redirect("back")
        
            } 
        } catch (error) {
            res.locals.flash=req.flash('error', error.message)
            return res.redirect("back")
        }

        
    }

}