/** this [user.js] file will contains all router and according which URL user entered related code will run 
 sometime this file will directly hit database or sometime process will go to [models/user.js] file . like if
 we want to create or update or login etc in this time process will go to the [models/user.js] file there 
 [middleware] is present then required code will run from [models/user.js] file then it will hit database and 
 then response will come in this file [routers/user.js] . Sometime this file will directly hit the database 
 like if [user deletion, fetching the data etc]
 */


const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');// [multer] gives support to upload the files
const sharp = require('sharp');// [sharp] is a package of npm . [sharp] uses many libraries so it take more time to
// install . while installing the [sharp] i did not give [version] i installed directly .
// [sharp] is used to [crop] the image and to change the [file type]
const { sendWelcomeEmail , sendCancelationEmail } = require('../emails/account');// here we are using the [destructuring]

 
/**** it was for testing purpose ****************************************************************************

router.get('/test',(req,res)=>{
    res.send('this is from another file');
})

***************************************************************************************************************/


/********************* here we are creating the user that means this is for [sign up] *******************************/

/** ** this route hadler does not contain [async await] **************************************************
 
router.post('/users',(req,res)=>{// this is [route handler] that means if in URL [/users] is given after
    // normal url for this application then this route handler will execute and inside codes will run

    //console.log(req.body);// here we are printing the [document ] that client sent
    //res.send('testing');// this is for testing purpose if this route handler run this [testing] will print
    // on client browser

    const user = new User(req.body);// as we said that [document] sent by client will be stored in [body]
    // of [req] object, and we will create an final object or [document] from [Users function construnctor]
    // that will be stored into [Users collection]
    user.save().then(()=>{ // here we are saving the document into [Users collection]. it will return the prommise,
        // so when promise is [resolved] after that [then] method will run
         res.status(201).send(user);// if successful then sending the [stored] document to the client as response,
         // status [201] means [user is creating successfully]
    }).catch((e)=>{
        // res.status(400);// here if error occure then status should not be [200] that means [ok], so if error 
        // comes then we will put status as [400]
        // res.send(e);// here we are sending the [error] to client as response 
        res.status(400).send(e);// here instead of 2 lines we have done in one line, status [400] means [bad request]
    })
})

*/

/*********  here we are using [async await] in rout handler ***********************************************/

router.post('/users',async (req,res)=>{// as we know that is we use [await] then function should be [async] , so we 
    // have to use [await] that's why we created this call back function as [async]
    // as we know that [async] function always return [promise] but here in this [async] callback function we are 
    // not using [then] to wait for [resolving of promise]. Actually [express] does not care that [promise] is return 
    // or what . [express] will deal with [req and res].
 
    const user = new User(req.body);
    try{
    await user.save(); // after that middleware code will run that  present in [model/user.js]
    sendWelcomeEmail(user.email,user.name);// so when user is saved then this welcome email will be sent. this 
    // function may return [promise] and we can use here [await] but there is no requirement that first email
    // will be sent to the user then remaining code will be run. Rest codes will run email will be sent later also 
    // no problem
    const token = await user.genarateAuthToken();// so when ever any user signup then we will provide token to user.
    // user can take this token
      // and can use this in the request where authentication is required . No requirement to login again . 
    res.status(201).send({ user , token});
    } catch(e){
      res.status(400).send(e);
    }

})

// this route handler will use for [login]

router.post('/users/login', async (req,res)=>{
    try{
     const user = await User.findByCredentials(req.body.email,req.body.password);// here we called [findByCredentials]
     // function that we will create in [models/users.js] so here we called this function by using [User] model name
     // so it will search this function in [[models/users.js]] file because we import this route here.
     // this [findByCredentials] function will accept [email and password] that client gave while requesting and this
     // function will  do authorization. either it will throw [error] or related [user document]
     // we put this function in [models/users.js] because it will contain middleware code

     const token = await user.genarateAuthToken();// this function is created in [models/user.js] file ,this function
      // will work as middleware . 
     // it  will create the token for the user who want to login here . we are calling this function by useing [user] that
     //given by [findByCredentials] function that means this user exist in the data base , this function will return
     // generated token .
     //console.log(token);// this is for debugging
     //res.send({user: user.getPublicProfile(),token});// here we are calling [getPublicProfile] function that is present
     // in [models/user.js] , by using this function we can hide some informations like [password] and [tokens]
      res.send({user: user,token});// here we are returning an object with user info and token , user can take this token
      // and can use this in the request where authentication is required .
      // here no need to call [getPublicProfile] function to hide the data in [models/user.js] file we call [toJSON]
      // method that will do all hide process
    }catch(e){
      // console.log('we reached in catch');// It was for debugging purpose
       res.status(400).send();
    } 
})

/*** this router is for logout ********************************************************************* */

router.post('/users/logout', auth , async (req,res)=>{// from [auth] function we will get [current user] and 
    // [current token]
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{// here we are replacing the [current tokens] array
            // with new array where current session token will not be present so [filter] method will return the
            // array for that callback function will return true 
            return token.token !== req.token ; // so only whose tokens will be present that are not present in the 
            // current session 
        })
        await req.user.save();// so this user will save into database that did not contain current session token
        res.send();// here we will send the response
    }catch(e){
        res.status(500).send();// here if error occurs then we will send error
    }
    
})

/********************* this route is for logoutAll  ******************************************************/

router.post('/users/logoutAll', auth , async (req,res)=>{// from [auth] function we will get the [current user] and
    // [current token] , here also save logic we will apply like [logout route]
    try{
        req.user.tokens = [];// current user will not have any token .
        await req.user.save();
        res.send();
    }catch(e){
      res.status(500).send();
    }
    
})

/** by using this route handler user can get it's profile  *********************************************/

router.get('/users/me', auth , async (req,res)=>{//this router will return the profile of the user 
    //here we want logic that this route should work only when user 
    // either signup or login and for this ['/users/me'] router provide the token with request , this token is 
    // called [Bearer token] and before given the response to this request we will call [middleware/auth.js] here 
    // it will veryfy the token with signature and check that token is present n user profile in database or not.
    // and if everything is correct then this [middleware/auth.js] file will return respected user 
    //console.log('reached till this router');// it was for checking purpose
    //console.log(req.user);// it was for checking purpose
   res.send(req.user);// in [middleware/auth.js] , current will be put in [req.user]  that we can access here 
})

/********* here we are reading the all users from database ************************************************/

/** ** this route hadler does not contain [async await] **************************************************

router.get('/users',(req,res)=>{// this route handler is same as [when we are creating user] but difference is there we used [post]
    // and here we are using [Get]
    User.find({}).then((users)=>{// like [mongodb] in [mongoose] also there are [methods] to perform [CRUD] operation , on
        // models , so here we are using [find] method that will [read multiple users] in find method we have to pass [object]
        // to apply filter , here we passed [empty object] that means all users will be read
        res.send(users);
    }).catch((e)=>{
        res.status(500).send();// if error come then we will send only status [500] that means [internal server error]
    })
})

*/

/*********  here we are using [async await] in rout handler ***********************************************/
// we put this route handler as commented because no use to give all users information to a user .
// it will be security voiletion 

// router.get('/users',async (req,res)=>{
//     try{
//         const users = await User.find({});
//         res.send(users);
//     } catch(e){
//         res.status(500).send();
//     }
// })


// *****************************************************************************************************************
// actually now this route handler is not required because , a user should not get other user by given id also . user
// can get his profile only by given this route handler [/users/me]

// /******** here we are reading the particular user by id ************************************************/

// /** ** this route hadler does not contain [async await] **************************************************

// router.get('/users/:id',(req,res)=>{// this route handler will run when client will send [id] also with URL and by doing this [:id]
//     //we are storing id into as property with name [id] into [req.params] object . [:id] is called [route parameter]
//     //console.log(req.params);// it was for testing purpose , we are printing id that client send with URL

//     const _id = req.params.id;// [_id] will be the [string]
//     User.findById(_id).then((user)=>{// here  we are using [findById] method to read data for this id , we have [findOne] 
//         // method also , it will we used when we filter according another field like [emailId]. remember one thing that 
//         // in method for filter we have to pass [object] but here we are passing [string] so here [mongoose] do smart work
//         // it will change [string] into object . Not only this is the reason that we are using mongoose , mongoose is using
//         // because we can create model here with very nice way and this is very useful .
//         if(!user){ // if according the filter we did not get any data at this point [promise] does not show any error so [then] 
//             // will run but [user] does not have data so we will handle this situation also .
            
//             return res.status(404).send();// status [404] means [not found]
//         }
//         res.send(user);// if user fetch successfully then we will send this user info

//     }).catch((e)=>{
//         res.status(500).send();
//     })
// })

// */

// /*********  here we are using [async await] in rout handler ***********************************************/

// router.get('/users/:id', async (req,res)=>{
//      const _id = req.params.id;
//      try{
//     const user = await User.findById(_id);
//         if(!user){
//             return res.status(401).send();
//         }
//         res.send(user);
//      }catch(e){
//          res.status(500).send();
//      }

// })

// *************************************************************************************************************


/***** here we are updating the user ************************************************************************/

// router.patch('/users/:id', async (req,res)=>{// [patch] is a http requst to update like [get] and [post] 
// we commented it because a user can update only his profile

    router.patch('/users/me', auth , async (req,res)=>{// here from [auth middleware] it will verify that 
        // user is loged in .

    /**** here we did the code if client want to update as property that is not present in [fields] like [height:5.6] or
     a property that is not allowed to change like [_id:28y24hin2uiy2h] these cases [express] ignores , in these cases
     [express] will give data related given [_id] so client may confuse why it is not giving new update or if these operations
     are not possible then give the error message sothat client may have complete information for that we have to do code
    manually.
    
     */
     const updates = Object.keys(req.body);// [keys] will give an array of strings that contains [properties] of the 
     // object that client sent
    
     //console.log(`update = ${updates}`);// this was for testing purpose
      const allowedUpdates = ['name','email','password','age'];// here we are creating an array of the properties that 
      // we will allow to update
    
      const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));// [every] is an array method 
      // that will [iterate] the array[updates] and for every [property] of [updates] array it will call callback function
      // and check that this property is present in [allowedUpdates] array or not and if for every property , [every method]
      // gets [true] that only [every method] will return true and this is our requirement that every property of [updates]
      // array should be present in [isValidOperation]
    
      if(!isValidOperation){// that means we got as property that is not present in [allowedUpdates] array
          return res.status(400).send({error:'invalid updates:('});//[400] status means [bad request] 
      }
    
    
    
    
        try{
      // *******************************************************************************************************
         // these codes are required only when user is not verified but now user is verified by [auth middleware]

            //const user = await User.findByIdAndUpdate(req.params.id,req.body,{ new:true, runValidators:true});// in [findByIdAndUpdate]
            // method 2 arguments are essential (1) [id] that we are getting from [req.params] , (2) [object] with new
            // values that we want to update , remains arguments are optional like we passed [optional] object { new:true, runValidators:true}
            // here [new] means after updating it will return object with new value , actually [findByIdAndUpdate] also returns [user] 
            // of the given [id] but it is old value not new and [runValidators] means it will check 
            // new value that we want to update show pass all our validations

            /*  reason why I commented [findByIdAndUpdate] because because [findByIdAndUpdate] method bypasses the 
            mongoose and directly perform operation on database that's why  we use special properties like [runValidators etc]
            in [findByIdAndUpdate] method . so because of [findByIdAndUpdate] method [middleware] code will not run so we have
            to do [restructuring] of [findByIdAndUpdate] method . We will break [findByIdAndUpdate] method into parts 
            */

            //const user = await User.findById(req.params.id);// here we are fetching the [document] of the user that 
            // id is passed by client

            // const user = await User.findById(req.user._id);

            //updates.forEach((update)=> user[update]=req.body[update]);// here we are looping all the [properties] that
            // present in [object] sent by client and putting values of these properties from [request.body] object that is
            // sent by the client to [user] object that is fetch from the database . [updates] is array of string that contains
            // properties sent by user and {user[update]} will indicate the current iteration property value

    // ************************************************************************************************************
            
            updates.forEach((update)=> req.user[update]=req.body[update]);//[req.user] will have [user] all 
            // informations from [auth middleware]

            await req.user.save();// after that [middleware] code will run because there we are using [save] event .
            
/****   these codes are required only when user is not verified but now user is verified by [auth middleware] *****
                    if(!user){
                res.status(404).send();// stattus [404] means [not found]
            }
              res.send(user);
**************************************************************************************************************/

            res.send(req.user);
        }catch(e){
            res.status(500).send(e);// status [500] means [internal server error]
        }
    })
    
/***********  here we are deleting the user ***************************************************************/

// router.delete('/users/:id',async (req,res)=>{// now we have to change the route handler because a user can't 
// delete user by given id , he can delete himself only after loged in
    router.delete('/users/me', auth ,async (req,res)=>{// here we will call [auth middleware] so it will verify that
        // user loged in or not and it will put user data in [req] object

    try{
        /* all these codes are not required there bw required if user is not verified but it is verified by 
        [auth middleware]

        const user = await User.findByIdAndDelete(req.params.id);
        const user = await User.findByIdAndDelete(req.user._id);
        if(!user){
           return res.status(404).send();
        }

        */

      await req.user.remove(); // [ remove] is mongoose method like [save], that will remove loged in user from the database.
      //res.send(user);// now only [user] does not exist . 
      //console.log('before sending function');// it was for checking purpose
      await sendCancelationEmail(req.user.email , req.user.name);// when user is deleted then this function will send the 
      // email to the user .
      //console.log('after sending function');// it was for checking purpose
      res.send(req.user); 
    }catch(e){
        res.status(500).send();
    }
})

/************ here we are uploading the profile picture of the user *************************************** */

// if you have doubt in this then go to [index.js] , I explained everything there about file uploading

const avatar = multer({
    //dest:'avatars',// we are commenting it because till now we are saving the file to project directory that is wrong
    // because when we deploy the project in different servers then data may loose
    // so it is advisable to save data in server repository like [heroku or aws etc]
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please, upload photo format'));
        }
        cb(undefined,true);


    }
})

router.post('/users/me/avatar', auth , avatar.single('avatar') , async (req,res)=>{// here we are calling [auth] function
    // because we want to save user profile picture in his profile in database
    // [Flow Chart] => request will come to this route handler => [auth] function will call you know what is the use 
    // of auth function => [avatar.single('avatar')] function will call , it is [multer middleware] that means
    // [multer library] will process the file and validate [size, type etc] and pass to the callback function =>
    // [async (req,res)] this callback function will do remaining processing 
      
      //req.user.avatar = req.file.buffer;// binary image data is saved into [file]

      const buffer = await sharp(req.file.buffer).resize({ width: 250 , height: 250 }).png().toBuffer();
      // here we are normalize the image like we normalize email like email should be small latter
      // [sharp] is an [asyncronous] function . here we are passing file buffer data to [sharp] function and 
      // [resize] function will crop the photo but if you want to crop graphically then it will be done at client side by tools
      // [png] function will change the [photo' type] to [png] after that
      // [toBuffer] function will convert back to buffer

      req.user.avatar = buffer;// uper buffer value we will save into database

      await req.user.save();// we made changes in above line now we are saving all these changes
      res.send();
}, (error, req, res, next ) =>{
    res.status(400).send({error: error.message});
})

/************ here we are deleting the user profile picture (avatar) *********************************************/

router.delete('/users/me/avatar', auth , async (req,res)=>{
    req.user.avatar = undefined;// that means [avatar] field will have [undefined]
    await req.user.save();
    res.send();
})

/********** here we are getting the any user's profile picture by using this user's id  **************************/

router.get('/users/:id/avatar', async (req,res)=>{// if we type this router into browser then we will get profile
    // picture of the user which id we gave 
    try{
     const user = await User.findById(req.params.id);
     if(!user || !user.avatar){// if user does not exist or user's profile picture does not exist then error will throw 
       throw new Error();
     }

     // res.set('Content-Type','image/jpg');// here we are setting [response header], actually if we are sending the responce
     // or file so we should tell which type of response or which type of file it is . For that we set [response header]
     // [Content-Type] is the name of response header . it is very famous header name 
     // if we don't give header name then [express] will set header name for us . 
     // [image/jpg] this is the header value , when we were sending the [json response] then [express] set 
     // [response header value] as [application/json]

     res.set('Content-Type','image/png');

     res.send(user.avatar);// here we are sending the [user profile picture] which [user's id] we gave

    }catch(error){
        res.status(404).send();
    }
})





module.exports = router;