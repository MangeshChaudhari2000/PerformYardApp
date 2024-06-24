import express from 'express';
import jwt from 'jsonwebtoken';

import UserRepository from '../model/repository/user.repository.js';
import ReviewRepository from '../model/repository/review.repository.js';

export default class UserController {

    constructor() {
        this.userRepository = new UserRepository();
        this.reviewRepository=new ReviewRepository();
    }

    SignUp = async (req, res) => {
        try {
            const isSaved = await this.userRepository.signUp(req.body);
            if (isSaved) {
                req.flash('success', "user added successfully");
                return res.render('signIn', { flash: req.flash() })
            }
        } catch (error) {
            req.flash('error', error.message)
            return res.render('signUp', { flash: req.flash() })
        }

    }

    SignIn = async (req, res) => {
        try {
            const isExist = await this.userRepository.signIn(req.body);
            if (isExist) {
                const tempToken = jwt.sign(
                    {
                        userId: isExist._id,
                        emailId: isExist.emailId,
                        role: isExist.role
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '1h'
                    }
                )
                const tempData = { name: isExist.firstName, emailId: isExist.emailId, _id:isExist._id, reviewAssigned:isExist.reviewAssigned,feedbackReceived:isExist.feedbackReceived };

                req.session.token = tempToken;
                req.session.data = tempData;
                req.flash('success', `Welcome aboard, ${isExist.firstName}! Sign-in successful! `);
                return res.render('homePage', { role: isExist.role, flash: req.flash() });
            }

        } catch (error) {
            req.flash('error', error.message)
            return res.render('signIn', { flash: req.flash() })
        }
    }

    searchUser = async (req, res) => {
        try {
            const userDetails = await this.userRepository.findUserbyEmail(req.body.emailId)
            if (userDetails) {
                return res.render("manageEmployee", { userDetails: userDetails, flash: req.flash() })
            } else {
                req.flash('error', "No user found")
                return res.render("manageEmployee", { userDetails: '', flash: req.flash() })
            }
        } catch (error) {
            req.flash('error', error.message)
            return res.render('signIn', { flash: req.flash() })
        }

    }

    updateEmployee = async (req, res) => {
        try {
            const userId = req.params.id;
            const isUpdated = await this.userRepository.updateEmployee(userId, req.body);
            if (isUpdated) {
                req.flash('success', "Employee details have been successfully updated");
                return res.render('manageEmployee', { userDetails: isUpdated, flash: req.flash() });
            }
        } catch (error) {
            req.flash('error', error.message)
            return res.render('manageEmployee', { userDetails: '', flash: req.flash() });
        }

    }

    deleteEmployee = async (req, res) => {
        try {
            const userId = req.params.id;
            const isDeleted = await this.userRepository.deleteEmployee(userId);
            if (isDeleted) {
                req.flash("success", `${isDeleted.emailId} deleted Successfully`)
                res.render("manageEmployee", { userDetails: '', flash: req.flash() })
            }
        } catch (error) {
            req.flash("error", error.message)
            res.render("manageEmployee", { userDetails: '', flash: req.flash() })
        }

    }

    addRecipient = async (req, res) => {
        const recipientEmailId = req.body.recipientMailId;
        const reviwerId = req.params.id;
        try {
            const isAdded = await this.userRepository.addRecipient(recipientEmailId, reviwerId);
            if (isAdded) {
                req.flash('success', "Recipient assigned")
                return res.render("manageEmployee", { userDetails: isAdded, flash: req.flash() })
            }
        } catch (error) {
            res.locals.flash=req.flash('error', error.message)
            const user=await this.userRepository.findUserbyUserId(reviwerId);
            return res.render("manageEmployee", { userDetails: user, flash: req.flash() })
        }

    }

    getFeedback = async (req, res) => {
        try {
            const reviewerId = req.params.reviewerId;
            const feedBack = await this.reviewRepository.getFeedback(reviewerId)
            const userDetails = await this.userRepository.findUserbyUserId(reviewerId)
            if (feedBack) {
                
                return res.render("manageReview", { userDetails: userDetails, recipientDetails: "", feedBackDetails: feedBack, flash: req.flash() })
            } else {
                req.flash('error', "No Feedback received")
                return res.render("manageReview", { userDetails: userDetails, recipientDetails: "", feedBackDetails: "", flash: req.flash() })
            }
        } catch (error) {
            req.flash('error', error.message)
            return res.render('manageReview', { userDetails: "", recipientDetails: "", feedBackDetails: "", flash: req.flash() })
        }

    }


}
