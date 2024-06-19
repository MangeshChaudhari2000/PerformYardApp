
export const setFlash=async(req,res,next)=>{
    res.locals.flash={
        // for success
        'success':req.flash('success'),
        // for error
        'error':req.flash('error')
        }

        next();


}