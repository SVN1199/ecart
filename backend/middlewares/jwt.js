const sendToken = (user, statusCode, res) => {

    // creating jwt token
    const token = user.getJwtToken();

    // cookie details
    //Response.cookie(name: string, val: string, options: CookieOptions): this
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    res.status(statusCode) 
        .cookie('token', token, options)  //to set token in cookie
        .json({
            success: true,
            user,
            token
        })
}



module.exports = sendToken