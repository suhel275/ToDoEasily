/*** this file will provide the temple of the [User model] and it will contains some [middleware] codes  that will 
 perform according the requirement , I explained everything in [routers/user.js], go there you will understand everything.
*/

const mongoose = require('mongoose');// here we are importing the [mongoose] module, mongodb should run in other
// terminal
const validator = require('validator');
const bcrypt = require('bcryptjs');// this is npm library to created hash password
const jwt = require('jsonwebtoken');
const Task = require('./task');

// as we said in [mongoose.js] file that if we create any model in this application then this model will save
// in [task-manager] database

// Remember one thing that when we give the field  while creating the model then sequence is not matter like
// like [name] is before or [age] is before, same while creating the property of field sequence does not 
// matter like [type] is before or [required] is before.

/*** we commented out all these because here we are passing direct oject as a templete of the [User model] , which fields
    will be present in [User model]. our requirement is more so see uncommented codes *******************************
 
const User = mongoose.model('User',{
       name:{
           type:String,
           required:true,
           trim:true,
           default:'Suhel'
},
       age:{
           type:Number,
           default:0,
           validate(value){
               if(value<0){
                   throw  new Error('age can not be negative ');
               }
           }

       },
       email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,// this is provided by [mongoose] and change our input into lowercase
        validate(value){
            if(!validator.isEmail(value)){// this is provided by [validator npm module] and return true if
                // emaill id is valid, we apply [!] because if email id is not valid then code will run
                throw new Error('Email is invalid');
            }
        }
    },
       password:{
           type:String,
           require:true,
           trim:true,
           minlength: 7,// this is [mongoose] property, here password length will not be less than 7

           validate(value){
        
            // this is how I was doing the manual validation with out using [minlength] property 

            //    if(value.length<=6){
            //        throw new Error('password length should be more than 6 ');
            //    }else if(value.includes('password')){
            //        throw new Error('password string should not be there');
            //    }


            if(value.toLowerCase().includes('password')){// here we usen [toLowerCase] method because if user 
                // use "PasSWord" then also our validation will work
                throw new Error('password should not contain "password" substring');
            }



           }
          

       }
})
***************************************************************************************************************/
/** our requirement is whenever any new user is added then password will be there and if any user password is
 updted then before saving to the database this peice of code should be run . so here [middleware] concept comes
 this code will work as a middleware between request name save to the database .
 */

 /* flow is like that when client send request then it goes to related route handler then it comes to middleware and check which
  event is called if event is related to the request then [middleware] code run otherwise action on database . here
  [save] event is used and in [user creation route handler] and [in user updation route handler] we use [save] method
  so this middleware code will run for [user creation] and [user updation request]

  */
 
const userSchema = new mongoose.Schema({// what happens in actually is when we were passing direct object into 
    // [User model] then behind the scene this object is converted into [schema] . so here we are creating [userSchema]
    // object of [mongoose's Schema function constructor] and in this function constructor we are passing out [object]
    // that is template of the [User model]
    name:{
        type:String,
        required:true,
        trim:true,
        default:'Suhel'
},
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw  new Error('age can not be negative ');
            }
        }

    },
    email:{
     type:String,
     unique:true,// that means [email] will also be unique like [id] we added this property of field later after
     // putting many entries into databse . this property of field will do indexing so we have to drop database and
     // create again sothat index may setup. so whenever we create the user if databse or model is not here then 
     // first it will create database and model then puts the user in it. 
     required:true,
     trim:true,
     lowercase:true,// this is provided by [mongoose] and change our input into lowercase
     validate(value){
         if(!validator.isEmail(value)){// this is provided by [validator npm module] and return true if
             // emaill id is valid, we apply [!] because if email id is not valid then code will run
             throw new Error('Email is invalid');
         }
     }
 },
 tokens:[{// here we are creating one more files in models that is array and it will contains all tokens that is 
    // generated for the same user ,  because at a time your can 
    // login from multiple devices and for every login token will be gerated. because we have to track the tokens
    // otherwise user logout then also token will be present and if someone got then missuse. So if user logout from
    // any device then one token will be deleted from the database of user profile.
  token:{// understand like that in [tokens array] , multiple documents are present and every document will have 2 
    // fields (1) [token] that will be in string form that we declared as property (2) [_id] we are not going to use 
    // this id. 
    //this document is called subdocument
      type:String,
      required:true
      // these 2 properties for [token] field is enough remaining like [trim etc] server will take care
  }
 }
 ],
 avatar:{// this field is created to save user's profile picture into database
    type:Buffer// [buffer] contains all binary data of the file .
    // [required] property will not be added because profile picture is not required 
    // [no validation] because [multer] will take care about validation . 
 },
    password:{
        type:String,
        require:true,
        trim:true,
        minlength: 7,// this is [mongoose] property, here password length will not be less than 7

        validate(value){
     
         // this is how I was doing the manual validation with out using [minlength] property 

         //    if(value.length<=6){
         //        throw new Error('password length should be more than 6 ');
         //    }else if(value.includes('password')){
         //        throw new Error('password string should not be there');
         //    }


         if(value.toLowerCase().includes('password')){// here we usen [toLowerCase] method because if user 
             // use "PasSWord" then also our validation will work
             throw new Error('password should not contain "password" substring');
         }



        }
       

    }
},
{
    timestamps:true// this is mongoose feature , it will track that when user is [signup] and when user is [modified],
    // bydefauls [timestamps] value is [false]
});

/** here we are doing authorazation while user login *******************************************************/

userSchema.statics.findByCredentials = async (email,password)=>{// this function will be called from [routers/users.js]
    // this function is created by using [userSchema.statics] that means it will work as [middleware] and when we 
    // called this function in [routers/users.js] file then control will come here . if we directle pass object without
    // schema then flow will not come here will go to database.
    //console.log('we are in funcntion (findByCredentials)');// this is for debugging
    const user = await User.findOne({email});// [findOne] is also work as [findById] we have to pass object for filtering
    // here we are using [shorthand syntax] in [email] passing
   // console.log(`this is user after email ${user}`);// this is for debugging
    if(!user){
        //console.log('we reached email error');// this is for debugging
        throw new Error('Unable to login');// that means provided email not present so it will throw error and remain proces 
        // will stop . our email field have property that it should be unique like [id]
    }

    const isMatched = await bcrypt.compare(password,user.password);// here it will check that provided [pain password]
    // is matching with it's hash form that present in database 
    if(!isMatched){
        console.log('we reached till isMatched');// this is for debugging
        throw new Error('Unable to login');//that means possword did not match . [Remember onething that we should not
    // provide specific error in authentication like here if we say that email matched but pssword did not match
// that means we are exposing email so provide same error for every checking]
    }
    return user;// that means [email] and [password] both matched and we are returning corresponding [user] 
}

/*
userSchema.methods.getPublicProfile = function(){// this function is called in [login] route handler 
    const user = this ;// here [user] will have all info of current user
    const userObject = user.toObject();// here we are generating row profile data that can be manpulated

    delete userObject.password;// form here password will delete
    delete userObject.tokens;// from here tokens will delete
    return userObject;
}

*/

userSchema.methods.toJSON = function(){// [toJSON] is case sensitive. this will be called when normally user is sent
    // in [res.send] 
    // now question is how this [toJSON] function will be called .
    // remember onething that when [res.send] is called that time object is [stringify] by express at that time if
    // if [toJSON] method is present then it will call because we are pass [user] and that is fetched from [User]
    //model so [toJSON] method will call because it present in [User] model. 
    // to better understand see code in [index.js] related this topic
    const user = this ;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;// here we are deleting the binary data of the user's profile picture that will not 
    // present when user profile is fetched but if user profile picture if fetched then picture will come
    return userObject;
}

userSchema.methods.genarateAuthToken = async function(){// this function will be called in [routers/user.js] file .
// this is instance method that means it will be called for the specific user , here we will use [standard function]
// not [arrow function] because binding is required .
    const user = this;// we are calling this function by useing [user] that
    //given by [findByCredentials] function that means this user exist in the data base, and all info will pass 
    // from [this] to [user]
    // const token = jwt.sign({ _id:user._id.toString()},'thisisjsonwebtoken');// we explained everything about this 
    // in [index.js] file , if you want you can go there 
    // here [signature string] we are hardcoded that is not secure
    //console.log(` this is in model ${token}`);// this is for debugging

    const token = jwt.sign({ _id:user._id.toString()},process.env.JWT_SECRET);// here [signature string] will be taken from environment variable 
    // that we created in [config/dev.env] file . but it will run for local machine not server

    user.tokens = user.tokens.concat({token});// [concat] method is used to join 2 arrays and give new array , existing
    // arrays are not effected , here [tokens] is arra and {token} is object so we can concate both also, more info
    // in same file go to section where model is created you will understand.
    await user.save();// now new generated token also stored into user's info into database
    return token;

}

/*****************************in virtual function we are not going to change anything , it is to figureout 
  relationship between [User model] and [Task model] by mongoose, it will not save into database ***********/

userSchema.virtual('tasks',{// virtual is a relationship between 2 entities in our case that is [User model] and
    //[Task model]  . actually in [User model] we will not create [array of tasks] like [array of tokens] . so we 
    // created virtual field we gave name of the field is [tasks] , we can give any name . Second argument will be 
    // object  
    ref:'Task',// here we will give [model name 'Task'] like we gave in [Task model]
    localField:'_id',// in [Task] model this is the [primary key] that is [_id]
    foreignField:'owner'// this is [foreign key] in [Task model]
})

/** here we are changing the plain password to hash password whenever [save] event is called from [routers/user.js] .
 It increases reusability.
 * **********************************/

userSchema.pre('save',async function(next){// this object of [Schema] contains many methods like [pre,post etc] , here
    // we are using pre that means whenever we [create] and [update] user , at that time we have to save the data
    // so this [method] will run because here [save] event is used . and as a second argument we will pass 
    // [standard function will async] because we have to use [await] and [standard function] because as we know 
    // that [arraw function] can not do [this keyword binding]. here we are passing [next] argument in the [standard function]
    // about this we will explain below
     const user = this;// here [this] keyword will have the [object] that is passed by the client [to create] or
    //[to update] the user 
    //console.log('just before saving');// it was for checking purpose.

   if(user.isModified('password')){// here we are checking in the [object] that client sent [password] is modified or not
    // that means if [object] is to create new user then this code will run. if [object] is for update then it will check
    // that password that present in [object] for that corresponding hash value present or not . if another hash value
    // present then this code run
       user.password = await bcrypt.hash(user.password,8);// here we are creating from [text pasword] to [hash password]
       // we created sample code in [index.js] , go there you will understand bettter
   }
    next();// here we are saying that middleware did it's work now you can save into database, if we don't call [next] function
    // then it will run [forever] . 
})

// when user is removed then all tasks will be deleted created by this user

userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({ owner : user._id});
    //await Task.deleteMany({ owner : req.user._id});// it will give error that means by [auth function] [req.user]
    // value did not set yet
    next();
})



const User = mongoose.model('User', userSchema);

module.exports = User; 


