import mongoose from "mongoose";
import express from "express";
import bcrypt from 'bcryptjs';


import { UserModel } from "../schema/user.schema.js";
import ApplicationError from "../../service/application.errorHandler.js";


export default class UserRepository {

    signUp = async (body) => {
        try {
            const newPassword = await bcrypt.hash(body.password, 12);
            body.password = newPassword;
            if (body.role == "Admin") {
                const regex = /admin\.com$/;
                const emailId = body.emailId;
                if (regex.test(emailId)) {
                    const add = new UserModel(body);
                    const isSaved = await add.save();
                    if (isSaved) {
                        return add;
                    }
                }
                else {
                    throw new ApplicationError("Your email address does not qualify for the admin role.", 400);
                }
            }
            else {
                const add = new UserModel(body);
                const isSaved = await add.save();
                if (isSaved) {
                    return add;
                }
            }


        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                // Duplicate email ID error
                throw new Error(error.message);
            } else {
                throw new ApplicationError(error.message, 400);
            }
        }
    }

    signIn = async (body) => {
        try {
            const isEmailExist = await UserModel.findOne({ emailId: body.emailId });
            if (isEmailExist) {
                const isPasswordMatched = await bcrypt.compare(body.password, isEmailExist.password);
                if (isPasswordMatched) {
                    return isEmailExist;
                } else {
                    throw new ApplicationError("Password not matched")
                }
            }
            else {
                throw new ApplicationError("EmailId does not exist")
            }
        } catch (error) {
            throw new ApplicationError(error.message, 400);
        }



    }

    findUserbyEmail = async (emailId) => {
        try {
            const users = await UserModel.findOne({ emailId: emailId });
            if (users) {
                return users
            }
        } catch (error) {
            throw new ApplicationError(error.message, 400);
        }

    }

    findUserbyUserId = async (userId) => {
        try {
            const users = await UserModel.findById(userId);
            if (users) {
                return users
            } else {
                throw new ApplicationError("userId not found", 400);

            }
        } catch (error) {
            throw new ApplicationError(error.message, 400);
        }
    }

    updateEmployee = async (id, body) => {

        try {
            const user = await UserModel.findById(id);

            if (body.firstName) {
                user.firstName = body.firstName;
            }
            if (body.lastName) {
                user.lastName = body.lastName;
            }
            if (body.phoneNo) {
                user.phoneNo = body.phoneNo;
            }
            if (body.role) {
                user.role = body.role;
            }

            const isUpdated = await user.save();
            if (isUpdated) {
                return user;
            }
        } catch (error) {
            throw new ApplicationError(error.message, 400);
        }
    }

    deleteEmployee = async (id) => {
        try {
            const isDeleted = await UserModel.findByIdAndDelete(id);
            if (isDeleted) {
                return isDeleted;
            }
        } catch (error) {
            throw new ApplicationError(error.message, 400);
        }

    }

    addRecipient = async (recipientEmailId, reviwerId) => {
        try {

            const isRecipientExist = await UserModel.findOne({ emailId: recipientEmailId });
            if (isRecipientExist) {
                // const update= await UserModel.findByIdAndUpdate(reviwerId,{reviewAssigned:isRecipientExist._id});
                const reviewerDetails = await UserModel.findById(reviwerId);
                if(isRecipientExist._id==reviwerId){
                    throw new ApplicationError("You cannot review yourself!",400)
                }

                if (!(reviewerDetails.reviewAssigned).includes(isRecipientExist._id)) {
                    (reviewerDetails.reviewAssigned).push(isRecipientExist._id);
                } else {
                    throw new ApplicationError(`Recipient ${recipientEmailId}  already assigned to ${reviewerDetails.emailId}`, 400);
                }

                const isSaved = await reviewerDetails.save();
                if (isSaved) {
                    return reviewerDetails
                }
            } else {
                throw new ApplicationError("Recipient email address not found", 400);
            }
        } catch (error) {
            throw new ApplicationError(error.message, 400);

        }

    }




}

