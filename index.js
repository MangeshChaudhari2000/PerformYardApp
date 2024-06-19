import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import ejsLayouts from 'express-ejs-layouts';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';
import Swal from 'sweetalert2'
import methodOverride from 'method-override'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';


import mongooseConnection from './src/service/mongooseConnection.js';
import userRouter from './src/route/user.route.js';
import reviewRouter from './src/route/review.route.js';
import { setFlash } from './src/service/flash.middleware.js';
import ApplicationError from './src/service/application.errorHandler.js';

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(),'src', 'view'));
app.use(ejsLayouts);
app.use(express.json());
app.use(methodOverride('_method'));
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//setting up session & flash
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 100
    }
}))

app.use(flash());
app.use(setFlash);

app.use('/',userRouter)
app.use('/review',reviewRouter);



// app.use((err, req, res, next) => {
//     if (err instanceof mongoose.Error.ValidationError) {
//         return res.render('error');
//         // return res.status(400).send(err.message);
//     }
//     if (err instanceof ApplicationError) {
//         return res.render('error');
//     //    return res.status(err.code, err.message);
//     }
//     return res.render('error');

// //    return res.status(500).send(err)
// })


app.listen(3000,()=>{
    console.log("server is running on port 3000");
    mongooseConnection();
})