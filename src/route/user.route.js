import express from 'express';
import mongoose from 'mongoose';
import UserController from '../controller/user.controller.js';
import jwtAuth from '../middleware/jwtAuth.middleware.js';

const userController=new UserController();

const userRouter = express.Router();

userRouter.post('/', (req, res) => {
    userController.SignIn(req,res);
});

userRouter.post('/signUp', (req, res) => {
    userController.SignUp(req,res);
});

userRouter.post('/search',jwtAuth, (req, res) => {
    userController.searchUser(req,res);
});

userRouter.post('/searchForPermormance',jwtAuth, (req, res) => {
    userController.searchForPermormance(req,res);
});

userRouter.post('/updateEmployee/:id',jwtAuth, (req, res) => {
    userController.updateEmployee(req,res);
});


userRouter.post('/addRecipient/:id',jwtAuth, (req, res) => {
    userController.addRecipient(req,res);
});

userRouter.get('/deleteEmployee/:id',jwtAuth, (req, res) => {
    userController.deleteEmployee(req,res);
 });

userRouter.get('/manageEmployee',jwtAuth, (req, res) => {
   return res.render('manageEmployee',{userDetails:""})
});

userRouter.get('/homePage',jwtAuth, (req, res) => {
    return res.render('homePage');
});

userRouter.get('/', (req, res) => {
    return res.render('signIn');
});

userRouter.get('/signUp', (req, res) => {
    return res.render('signUp');
});

userRouter.get('/forgetPassword', (req, res) => {
    return res.render('forgetPassword'); // corrected typo here
});

userRouter.get('/feedbackreceived/:reviewerId', jwtAuth, (req, res) => {
    userController.getFeedback(req, res)
});


export default userRouter;
