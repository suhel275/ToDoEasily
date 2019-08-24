const mongoose = require('mongoose');// here we are importing the [mongoose] module, mongodb should run in other
// terminal
//const validator = require('validator');// now [validator] is not required here when we started to put [models]
// on [models] folder
//mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{// here we are giving same URL as we gave in
// [mongodb.js] , but here with URL we are giving database name [task-manager-api] also
// here we gave [database name] in this URL only that means for this application if we create any [model] that
// will create in this [task-manager] database 
// here we are connecting with local machine database and we are hardcoding the [Database URL] . 

mongoose.connect(process.env.MONGODB_URL,{// here we are connectiong with local machine databse and
    // here [Database URL] will be taken from environment variable 
    // that we created in [config/dev.env] file . but it will run for local machine not server
     useNewUrlParser:true,
    useCreateIndex:true,// mongoose work with mongodb behind the scene so when indeces are created then it allows
    // mongoose to access indeces quickly
    useFindAndModify:false // this is used because in [task-manager/playground/promise-chaining.js] file while we
    // were using [findByIdAndUpdate] then we got [DeprecationWarning] , it was because behind the scene [mongoose] uses
    // [mongodb] and mongodb were using previous method so this warning occured in we put this [findByIdAndUpdate] property
    // value as [false] then this warning will not occure
    }
    )

    /********************************** here we created the [User] collection ******************************
 
const User = mongoose.model('User',{// here we are creating the [model] that means one type of templete of the 
    // document that we will insert into collection and first argument will be the name of collection, this is
    // [constructor function] 
    // remember one thing that in database collection name will be [users] , actually mongoose change the
    // collection name in small letter and make plural and polorized it
    name:{// this is the field that will be present in our document
       type:String// this is the [constructor function] of the javascript as value type , that means this data type
       // value will be present in this field
    },
    age:{
        type:Number
    }
// mongoose add one additional property[field] that is [version of the document] . 

})

*****************************************************************************************************/

/*****************************  here we are creating normal instance ********************************
 
const me = new User({// here we are creating instance of [Users] model, but when we create instance that time
    // value did not insert into database
    name:'Suhel',
    age:23
})

me.save().then(()=>{// [save] is the method of instance ,here value will be inserted into database and 
 //it will retuen promise , in [then] method no required to pass argument, but we have to use [instance] name
 // as result
    
    console.log(me);
}).catch((error)=>{
    console.log(error);
})

*********************************************************************************************************/
/************************** here we used argument in [then] method *************************************
 
const frnd1 = new User({
    name:'Arshad',
    age:24
})

frnd1.save().then((result)=>{// we can pass arguent in [then] method to get result
    console.log(result);
}).catch((error)=>{
    console.log(error);
})

************************************************************************************************/
/*************** here we are usin string that contains number ****************************************
 
const frnd2 = new User({
    name:'Arshad',
    age:'25'// here we are passing string that contains number but field type is number but no problem it will
    // convert it into number and insert into database 
})

frnd2.save().then(()=>{
    console.log(me);
}).catch((error)=>{
    console.log(error);
})

********************************************************************************************************/
/***********  here we are using string that contains [character] ************************************
 
const frnd3 = new User({
    name:'Arshad',
    age:'Suhel'// here error will come because we are passing string that contains character but field type 
    // is number so it will not be able to convert it , and in error it will so [validation] is applied here
    // so [mongoose] apply validation that we will learn later
})

frnd3.save().then(()=>{
    console.log(me);
}).catch((error)=>{
    console.log(error);
})

****************************************************************************************************/

/********************* It was coding challenge ******************************************************** 

const Task = mongoose.model('Task', {
      description:{
          type:String
      },
      completed:{
           type:Boolean
      }

})

const clean = new Task({
    description:'House cleaning',
    completed: true
})

clean.save().then(()=>{
    console.log(clean);
}).catch((error)=>{
    console.log(error);
})

*****************************************************************************************************/
/*************** here we applied validations that are provided my mongoose**************************
const Validate = mongoose.model('Validate',{

    name:{
        type:String,
        required:true// that means when document is enters name value should be there
    },
    age:{
        type:Number,
        validate(value){// this is method of [age] object , here we used ES6 method defination , [value] will
            // be what user enter
          if(value<0){
              throw new Error('age can not be negative' );// there we are throwing error if age is less than zero
              // for this validation we have to done code manually
          }
        }
    }

})

****************************************************************************************************/
/********** here we are not giving [name] value and it will give error ******************************
 
const validate1 = new Validate({

})

validate1.save().then(()=>{
    console.log(validate1);
}).catch((error)=>{
    console.log(error);
})

******************************************************************************************************/

/********* here we did not give [age] value but it is not [required] so no error document will be inserted
 into database
 ***************************************************************************************************

const validate2 = new Validate({
     name: 'Adnan'
})

validate2.save().then(()=>{
    console.log(validate2);
}).catch((error)=>{
    console.log(error);
})

****************************************************************************************************/

/**** here our manually coded validation will run  *******************************************************

const validate3 = new Validate({
    name: 'Adnan',
    age: -1// age value can not less than 0 so it will throw error
})

validate3.save().then(()=>{
   console.log(validate3);
}).catch((error)=>{
   console.log(error);
})

*/
/****here we are creating another collection where we will apply validation provide by [mongoose] 
 and [validator] npm module **********************************************************************

const ValidateModule = mongoose.model('ValidateModule',{

    name:{
        type:String,
        default:'Sohan',// this is provided by [mongoose] if this value not present in document then it will
        // take default value, this is required also so no error will throw if no value is provided in document
        required:true,// this is provided by [mongooose]
        trim:true// this is provided by [mongoose] and here we are doing sanitization that means it will formate
        // our input before saving into database that means it will remove extra space as [suffix] and [prefix]
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
    age:{
        type:Number,
        default:0,
        validate(value){
          if(value<0){
              throw new Error('age can not be negative' );
          }
        }
    }

})

******************************************************************************************************/

/********* here we are checking that it will not take invalid [emailid] *****************************

const validate4 = new ValidateModule({
    name: 'Mohan',
    email: 'mohan@',
    age: 30
})

validate4.save().then(()=>{
   console.log(validate4);
}).catch((error)=>{
   console.log(error);
})

**************************************************************************************************/
/***********************here we will check all validator that we applied *******************************
const validate5 = new ValidateModule({
    email: '    SUHan@gmail.cOm    '
})

validate5.save().then(()=>{
   console.log(validate5);
}).catch((error)=>{
   console.log(error);
})

******************************************************************************************************/
/**************** it was 1st coding challenge ****************************************************** */

/************************* here we created [User] model  *****************
 
const User = mongoose.model('User',{
       name:{
           type:String,
           required:true,
           trim:true,
           default:'Suhel'
},
       age:{
           type:Number,
           validate(value){
               if(value<0){
                   throw  new Error('age can not be negative ');
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
******************************************************************************************************/


/**************** it will work properly ************************************************************* 

const user1 = new User({
    name:'Rakesh',
    password:'   ghfgf8799uDD?Ikl    ',
    age: 87
    
})

**************************************************************************************************/
/**************** it will throw error because "password" substring is there ***************************
 
const user1 = new User({
    name:'Rakesh',
    age:89,
    password:'   ghfgpassword?Ikl    ',
})

*******************************************************************************************************/
/******************** it will throw error because password length is less than 7 **********************
 
const user1 = new User({
    name:'Rakesh',
    age:89,
    password:'sdfd',
})

******************************************************************************************************/

/***** it will throw error because after removing the spaces from password prefix and sufix password length 
 will be less than 7 ****************************************************************************
 
const user1 = new User({
    name:'Rakesh',
    age:89,
    password:'   ui                    ',
})

*****************************************************************************************************/
/**** here we are inserting the document into database ************************************************
 
user1.save().then(()=>{
    console.log(user1);
}).catch((error)=>{
    console.log(error);
})

****************************************************************************************************/
/********************* it was 2nd coding challenge  **************************************************/

/*** here we are creating task model  ************************************************************** *
 
const Task = mongoose.model('Task',{
    description:{
       type:String,
       required:true,
       trim:true
    },
    completed:{
        type:Boolean,
        default:false

    }
})

****************************************************************************************************/
/************************** It will work perfectly  *************************************************

const task = new Task({
    description:'    connection is created         ',
})

***************************************************************************************************/
/**************** It will throw error becouse description is required and we did not give ************
 
const task = new Task({
    
})

*******************************************************************************************************/
/***** here we are inserting document into database   *************************************************

task.save().then(()=>{
    console.log(task);
}).catch((error)=>{
    console.log(error);
})

********************************************************************************************************/