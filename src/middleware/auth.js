const jwt = require('jsonwebtoken');
const User = require('../models/user');// [..] means one directory before.

const auth = async (req,res,next)=>{// this function will be called from [routers/user.js] file and this function works
    // for express middleware .
    try{

    // console.log('auth middleware');// it was for checking purpose 
    // next();// it was for checking purpose.
    const token = req.header('Authorization').replace('Bearer ', '');//when we were sending the request then we used
    //[Authorization] as [key] for this token. [header] method will return token was sent by the request . in 
    //token [Bearer ] will be therer in the string so we wil replace it .
    // if we did not get [token] and apply [replace] then error occurs and [catch] block will run 
    //console.log(token);// It will print the token
    //const decode = jwt.verify(token,'thisisjsonwebtoken');// here we are verifying by giving [signature] that we gave 
    // while generating the token that means it will return the [payload] . 
    //  here [signature string] we are hardcoded that is not secure

    const decode = jwt.verify(token,process.env.JWT_SECRET);// here [signature string] will be taken from environment variable 
    // that we created in [config/dev.env] file . but it will run for local machine not server

   // console.log(decode);// it will print the [id of the user] and [token iat ]
    const user = await User.findOne({_id:decode._id,'tokens.token':token});
    // here we are checking that token may 
    // be present in the user profile in database . because there may be multiple tokens for one user because multiple
    // devices . if  user logout then token will delete from user profile .
    // ['tokens.token'] it is string because [tokens] is an array that contains object which object property is [token]. 
    if(!user){
        throw new Error();
    }
    req.token = token;// here we putting [token] value in [req] object sothant in router we can use it .
    req.user = user;// here we are putting [user] value in [req] object sothat in router no need to fetch [user] again .
    next();
    }catch(e){
        res.status(401).send('error: Please authenticate')
    }

}

module.exports = auth;