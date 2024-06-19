import jwt from 'jsonwebtoken'

const jwtAuth = (req, res, next) => {
    //1.REad Token
    const token = req.session.token;
    //2. if no token,reurn error
    if (!token) {
        req.flash('error',"Unauthorized access detected");
        return res.render('signIn',{flash:req.flash()})
    }
    //3. check if token is valid
    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        req.userId = payload.userId;
        req.role= payload.role;
        req.emailId=payload.emailId;
        res.locals.role=payload.role;
        //4. else return error
    } catch (error) {
        console.log(error);
        return res.redirect('/')

    }
    //5. call next middleware
    next();

}

export default jwtAuth;  
