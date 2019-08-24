/******* this [index.js] file will work like a [conroller] so it will make suke that our application is connected with
 database and it will introduce all [routers] files and [models] files and it will register the routers with our
 applications , that means [index.js] will fullfil thr requirements for our application .
 ***************************************************************************************************************/

// this [index.js] file will be our starting point of this [task-manager] app. So in [package.json] file
// in [start] script we gave [node src/index.js] that server will run like [heroku] and in [dev] script
// we gave [nodemon src/index.js] that we will run but command [nom run dev]

// first in this [index.js] file we created all routes by using [app] and without using [async await] , after that 
// we created all routes by using [app] and [async await] but to put all router in a file is not a good idea
// so we will put [user] related routers into [user.js] file and [task] related routers into [task.js] file
// and we will registers these routers in this [index.js] file. just see all three file [index.js],[user.js] and
// [task.js] you will understand everything .

// remember one thing that when you install any npm pachake that time you should have internet connectivity

const express = require('express');
require('./db/mongoose.js');// in [mongoose.js] file connectivity to database is there , so here we are
// not fetching anything , only then request will come from client then [index.js] will run and from this 
//[require] connectivity with database will be done
const User = require('./models/user.js');// in [user.js] file [Users model] is created that means [Users collection]
// is created that means a templete is created how [documents] will be put in the collection and what fields
// these documents will contain , so from these [required] we will get one [function constructor] to create 
// object of [Users] type

const Task = require('./models/task.js');//like [user.js] we are importing here [task.js]

const userRouter = require('./routers/user');// here we are importing the routers that are defined in [user.js]
const taskRouter = require('./routers/task');// here we are importing the routers that are defined in [user.js]

const app = express();

// const port = process.env.PORT || 3000;// here if we deploy in server then it will take port from environment variable
// but if we are running application in local machine then port number is hard coded that is [300]

const port = process.env.PORT ;// here in local machine also port number will be taken from environment variable 
// that we created in [config/dev.env] file .

// without middleware : new request -> run route handler
// with middleware : new request -> do something  -> run route handler (this is called express middleware)

// previously that middleware I created in [models/user.js] file that work between router handler and database
// and this middleware will work between request and route handler 
// as we know by using middleware we can control many things .
// by using this middleware we will apply this logic that every single request is required authentication except signup
// and login

/*
app.use((req,res,next)=>{// [app.use] is used to run the middleware . Remember onething that sequence is matter here
    // middleware should be first than other [app.use] function that are used to reguster the route handlers etc
    // other [app.use] we used express syntax but here we will pass our defined function. this function will receive
    // 3 arguments [req,res,next] and we know the work of all three .
    // console.log(req.method,req.path);// [res.method] will give method of http request like [GET , POST etc] and 
    // [req.path] will give URL of the request .
    // next();// if we don't use next then it will show processing for very long time and finally will give no respond 
    // get .we explained [next] before you can se that.
    if(req.method === 'GET'){// here we are not calling [next] for get method that means for [get] methods route 
        // handlers will not work
       res.send('Get requests are disabled');
    }else{
        next();
    }
})
*/
/******* it was coding challenge for every requesr router handleres should not work ****************************
 
app.use((req,res,next)=>{
    res.status(503).send('Site is under maintenance');
})

*/
app.use(express.json());// here we are parsing [json] to [object]that client sent as a request to create new user 
// in the data base , this [object] will be saved in the [body] of [req] object , and this [object] is a 
// document that will have fiels that will be put in [Users collection]

app.use(userRouter);// here we are regustering the imported routers form [user.js] with our existing app
app.use(taskRouter);// here we are regustering the imported routers from [user.js] with our existing app


/*** it was for testing purpose and it will not work because we did not register the router ********************

const router = new express.Router();
router.get('/test',(req,res)=>{
    res.send('this is router path');
})

***************************************************************************************************************/

/************ it was for testing purpose and it will run  *****************************************************
 
const router = new express.Router();// like we initialize the [application] by [const app = express();] here also
// we are initializing the [router]

router.get('/test',(req,res)=>{// like [app], [router] also contains [http] request methods like [get,post,delete..etc]
    res.send('this is router path');
})

app.use(router);// here we are registering the [router] with existing app

***************************************************************************************************************/
/*******  This code was for testing purpose  *******************************************************************
 
const bcrypt = require('bcryptjs');// here we are importing [bcryptjs] library to apply hash methods , we importing here
// not at the starting of the file , because it is only for testing purpose

const myFunction = async ()=>{// [bcryptjs] uses promises so we created this async function sothat we may use await
    const password = 'Red123!';// this is that [plain text] password that user will enter
    const hashPassword = await bcrypt.hash(password,8);//  this is the [hashpassword] that is encripted this password
    // will store actually into the database . [hash] is a method of [bcrypt library] that wil perform [hashing algorithm]
    // first argument will be the plain text, second argument will be the number of [round] that means how many times
    // hashing algorithm will perform, so creater of this method suggest [round value should be 8] , because if it is
    // less then it will be easy to crack but if it is more then it will take too much time then application will be
    // useless .
    console.log(password);
    console.log(hashPassword);

    //In [encrypt and decrypt] algorithms we can [encript] the text and then [decrypt] the text but in [hashing] algorithnm
    // we can [encript] the plain text but we can't [decrypt] the [encripted] text . This is the advantage of [hashing algorithm]
    // because if someone hacked database and have passwords in hashing form then it is useless he can't [decrypt] it.
    const isMatch = await bcrypt.compare('Red123!',hashPassword);// [isMatch] value will be true if [painText] match with 
    // [hashPassword] otherwise false . [compare] is also  method of [bcryptjs library] , first argument will be [painText]
    // second armument will be [hashPasssword] and it will create [hashPassword] from [plaintext] then compare both 
    // [hashPasswords]
    console.log(isMatch);// it will print true
    const isMatchAgain = await bcrypt.compare('red123!',hashPassword);
    console.log(isMatchAgain);// it will print false.
}

myFunction();

****************************************************************************************************************/
/********* it was for knowledge purpose . for more info about it see my notes  ****************************
 
const jwt = require('jsonwebtoken');// here we are importing [jsonwebtoken] , these codes for tesing purpose
const myFunction = async ()=>{
  // const token = jwt.sign({_id:'abc123'},'thisismyfirsttoken',{ expiresIn:'0 seconds'});
  const token = jwt.sign({_id:'abc123'},'thisismyfirsttoken',{ expiresIn:'7 days'});// [jwt] has method [sign] that 
  // create the [token] that means [authentication] and we will prodide this token to client to perform later tasks.
  // we can pass some arguments we passed 3 arguments
  // (1) [object] with some properties , this is called [PayLoad], here we are giving [id] property for the identification of the token , 
  //we can add more properties also and all these data will be stored into the token
  // (2) it will be the [singnature] that is series of random characters to make sure that token is not altered anywhere
  // (2) here we are passing an object that will contain life  of the ticket that means when this tocket will expire
  console.log(token);// here our generated token will print. you will see that token has [3 parts separated by 2 periods (.)]
  // (1) fisrt part contains [header informations] that means which type of token it is , in our case this is [jwt type]
  // and which algorithm is used to generate the the ticket
  // (2) [PayLoadBody] that means it contains data that we provide in our case it will contain [id].
  // (3) [signature] to verify the token that is issued 
  const data = jwt.verify(token,'thisismyfirsttoken');// [verify] is a method of [jwt] that will verify the token
  // with the signature that we provided while we created the token , so if anyone did alter in the ticket then
  // this method will give error . if token is verified sucessfully then this method will return [PayLoad] of the token 
  // that means info about the token
  // but signature will not be present in it.
  // in our case it will return [_id] id of token , [iat] that is [issued it] means let you know when token is created,
  // [exp] that means when your token will expire .
  console.log(data);
}

myFunction();

*************************************************************************************************************/


// /********************* here we are creating the user  ********************************************/

// /** ** this route handler does not contain [async await] **************************************************
 
// app.post('/users',(req,res)=>{// this is [route handler] that means if in URL [/users] is given after
//     // normal url for this application then this route handler will execute and inside codes will run

//     //console.log(req.body);// here we are printing the [document ] that client sent
//     //res.send('testing');// this is for testing purpose if this route handler run this [testing] will print
//     // on client browser

//     const user = new User(req.body);// as we said that [document] sent by client will be stored in [body]
//     // of [req] object, and we will create an final object or [document] from [Users function construnctor]
//     // that will be stored into [Users collection]
//     user.save().then(()=>{ // here we are saving the document into [Users collection]. it will return the prommise,
//         // so when promise is [resolved] after that [then] method will run
//          res.status(201).send(user);// if successful then sending the [stored] document to the client as response,
//          // status [201] means [user is creating successfully]
//     }).catch((e)=>{
//         // res.status(400);// here if error occure then status should not be [200] that means [ok], so if error 
//         // comes then we will put status as [400]
//         // res.send(e);// here we are sending the [error] to client as response 
//         res.status(400).send(e);// here instead of 2 lines we have done in one line, status [400] means [bad request]
//     })
// })

// */

// /*********  here we are using [async await] in rout handler ***********************************************/

// app.post('/users',async (req,res)=>{// as we know that is we use [await] then function should be [async] , so we 
//     // have to use [await] that's why we created this call back function as [async]
//     // as we know that [async] function always return [promise] but here in this [async] callback function we are 
//     // not using [then] to wait for [resolving of promise]. Actually [express] does not care that [promise] is return 
//     // or what . [express] will deal with [req and res].
 
//     const user = new User(req.body);
//     try{
//     await user.save();
//     res.status(201).send(user);
//     } catch(e){
//       res.status(400).send(e);
//     }

// })

// /***********************  it was the coding challenge  to create task *************************************/

// /** ** this route hadler does not contain [async await] **************************************************

// app.post('/tasks',(req,res)=>{
//     const task = new Task(req.body);
//     task.save().then(()=>{
//         res.status(201).send(task);// status [201] means [task is created successfully]
//     }).catch((e)=>{
//         res.status(400).send(e);
//     })

// })

// */

// /*********  here we are using [async await] in rout handler ***********************************************/

// app.post('/tasks', async (req,res)=>{
//     try{
//         const task = new Task(req.body);
//         await task.save();
//         res.status(201).send(task);
//     }catch(e){
//       res.status(500).send(e);
//     }
// })

// /********* here we are reading the all users from database ************************************************/

// /** ** this route hadler does not contain [async await] **************************************************

// app.get('/users',(req,res)=>{// this route handler is same as [when we are creating user] but difference is there we used [post]
//     // and here we are using [Get]
//     User.find({}).then((users)=>{// like [mongodb] in [mongoose] also there are [methods] to perform [CRUD] operation , on
//         // models , so here we are using [find] method that will [read multiple users] in find method we have to pass [object]
//         // to apply filter , here we passed [empty object] that means all users will be read
//         res.send(users);
//     }).catch((e)=>{
//         res.status(500).send();// if error come then we will send only status [500] that means [internal server error]
//     })
// })

// */

// /*********  here we are using [async await] in rout handler ***********************************************/

// app.get('/users',async (req,res)=>{
//     try{
//         const users = await User.find({});
//         res.send(users);
//     } catch(e){
//         res.status(500).send();
//     }
// })

// /******** here we are reading the particular user by id ************************************************/

// /** ** this route hadler does not contain [async await] **************************************************

// app.get('/users/:id',(req,res)=>{// this route handler will run when client will send [id] also with URL and by doing this [:id]
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

// app.get('/users/:id', async (req,res)=>{
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




// /**************it is coding challenge to read all tasks ****************************************************************/

// /** ** this route hadler does not contain [async await] **************************************************

// app.get('/tasks',(req,res)=>{
//     Task.find({}).then((tasks)=>{
//         res.send(tasks);
//     }).catch((e)=>{
//         res.status(500).send();
//     })

// })

// */

// /*********  here we are using [async await] in rout handler ***********************************************/

// app.get('/tasks', async (req,res)=>{
//     try{
//       const tasks = await Task.find({});
//       res.send(tasks);
//     }catch(e){
//         res.status(500).send();
//     }
// })

// /************ it is coding challenge to read one task  ************************************************************/

// /** ** this route hadler does not contain [async await] **************************************************

// app.get('/tasks/:id',(req,res)=>{
//     const _id = req.params.id;
//     Task.findById(_id).then((task)=>{
//         if(!task){
//             return res.status(404).send();
//         }
//             res.send(task);
//     }).catch((e)=>{
//         res.status(500).send();
//     })
// })

// */

// /*********  here we are using [async await] in rout handler ***********************************************/

// app.get('/tasks/:id',async (req,res)=>{
//     const  _id = req.params.id;
//     try{
//        const task = await Task.findById(_id);
//        if(!task){
//          return res.status(401).send();
//        }
//        res.send(task);
//     }catch(e){
//         res.status(500).send();
//     }
// })

// /***** here we are updating the user ************************************************************************/

// app.patch('/users/:id', async (req,res)=>{// [patch] is a http requst to update like [get] and [post] 

// /**** here we did the code if client want to update as property that is not present in [fields] like [height:5.6] or
//  a property that is not allowed to change like [_id:28y24hin2uiy2h] these cases [express] ignores , in these cases
//  [express] will give data related given [_id] so client may confuse why it is not giving new update or if these operations
//  are not possible then give the error message sothat client may have complete information for that we have to do code
// manually.

//  */
//  const updates = Object.keys(req.body);// [keys] will give an array of strings that contains [properties] of the 
//  // object that client sent

//  //console.log(`update = ${updates}`);// this was for testing purpose
//   const allowedUpdates = ['name','email','password','age'];// here we are creating an array of the properties that 
//   // we will allow to update

//   const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));// [every] is an array method 
//   // that will [iterate] the array[updates] and for every [property] of [updates] array it will call callback function
//   // and check that this property is present in [allowedUpdates] array or not and if for every property , [every method]
//   // gets [true] that only [every method] will return true and this is our requirement that every property of [updates]
//   // array should be present in [isValidOperation]

//   if(!isValidOperation){// that means we got as property that is not present in [allowedUpdates] array
//       return res.status(400).send({error:'invalid updates:('});//[400] status means [bad request] 
//   }




//     try{
//         const user = await User.findByIdAndUpdate(req.params.id,req.body,{ new:true, runValidators:true});// in [findByIdAndUpdate]
//         // method 2 arguments are essential (1) [id] that we are getting from [req.params] , (2) [object] with new
//         // values that we want to update , remains arguments are optional like we passed [optional] object { new:true, runValidators:true}
//         // here [new] means after updating it will return object with new value , actually [findByIdAndUpdate] also returns [user] 
//         // of the given [id] but it is old value not new and [runValidators] means it will check 
//         // new value that we want to update show pass all our validations
//                 if(!user){
//             res.status(404).send();// stattus [404] means [not found]
//         }
//           res.send(user);
//     }catch(e){
//         res.status(500).send(e);// status [500] means [internal server error]
//     }
// })


// /*** here we are updating task and it is a coding challenge ****************************************************/

// app.patch('/tasks/:id',async (req,res)=>{
//     const updates = Object.keys(req.body);// [keys] will give an array of strings that contains [properties] of the 
//     // object that client sent
   
//     //console.log(`update = ${updates}`);// this was for testing purpose
//      const allowedUpdates = ['description', 'completed'];// here we are creating an array of the properties that 
//      // we will allow to update
   
//      const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));// [every] is an array method 
//      // that will [iterate] the array[updates] and for every [property] of [updates] array it will call callback function
//      // and check that this property is present in [allowedUpdates] array or not and if for every property , [every method]
//      // gets [true] that only [every method] will return true and this is our requirement that every property of [updates]
//      // array should be present in [isValidOperation]
   
//      if(!isValidOperation){// that means we got as property that is not present in [allowedUpdates] array
//          return res.status(400).send({error:'invalid updates:('});//[400] status means [bad request] 
//      }

//      try{
//          const task = await Task.findByIdAndUpdate(req.params.id,req.body,{ new:true, runValidators:true});
//          if(!task){
//              return res.status(404).send();
//          }
//          res.send(task);

//      }catch(e){
//         res.status(500).send();
//      }
// })

// /***********  here we are deleting the user ***************************************************************/

// app.delete('/users/:id',async (req,res)=>{

//     try{
//         const user = await User.findByIdAndDelete(req.params.id);
//         if(!user){
//            return res.status(404).send();
//         }
//       res.send(user);
//     }catch(e){
//         res.status(500).send();
//     }
    
// })

// /******************** here we are deleting task and it was coding challenge *******************************/

// app.delete('/tasks/:id',async (req,res)=>{

//     try{
//         const task = await Task.findByIdAndDelete(req.params.id);
//         if(!task){
//            return res.status(404).send();
//         }
//       res.send(task);
//     }catch(e){
//         res.status(500).send();
//     }
    
// })


/***** this code to understand [toJSON] *******************************************************************
 
const pet = { // this is normal object
 name:'tommy'
}

pet.toJSON = function(){// this function will call automaticaally because stringify is done
//  console.log(this);
//  return this;// it will return all informations 
return {};// it will retuern nothing because we manipulated.
}

console.log(JSON.stringify(pet));// here we are doing stringify so it will be in JSON form 

*/


app.listen(port,()=>{
    console.log(`server is up on port ${port}`);
})

/******************* this is for playground to understand the concept *****************************************

const Task1 = require('./models/task');
const User1 = require('./models/user');

const main = async()=>{

    // ******** this is how we can fetch user from task *******************************************************

    // const task1 = await Task1.findById('5d550cd65835aa28a01f6e3a'); // here we are fetching the [task] by id
    
    // console.log(task1);// here it will print the fetched task
    
    // console.log(task1.owner);// it will print the [id] of the [user] that created this task . but problem is that 
    // if we want to fetch the whole document of the user then we have to fetch the [user document] by [task.owner]
    // mongoose provide some helper function sothat if we give [task1.owner] then we will have the whole document of
    // the user .
    
    // await task1.populate('owner').execPopulate();// this is mongoose helper function that will populate the 
    // data of the relationship . So if we use [task1.owner] then user whole document will be fetched . here we 
    // gave [owner] that is field in [Task model] that have user [user info] that created this task 

    // console.log(task1);// it will print the fetched task
    
    // console.log(task1.owner);// it will print the document of the user who created the task 

    //**********************************************************************************************************
    
    const user1 = await User1.findById('5d550c9d5835aa28a01f6e38');// here we are fetching the user from the id 
    await user1.populate('tasks').execPopulate();// this is mongoose helper function that will populate the 
    // data of the relationship . So if we use [user1.tasks] then all task whole document will be fetched those
    // are created by this user . here we gave [tasks] that is virtual field in [User model] that have
    // tasks info those are created by this user .  
    console.log(user1);// it will print the fetched user document 
    console.log(user1.tasks);// it will print the all tasks those are created by the user 
}

main();

*/

/********************************* this code for testing purpose  **************************************/

const multer = require('multer');// here we are importing [multer] package, actually , express bydefault does not 
// support file upload so we will use this npm package that is [multer] . 
// [multer] fullform is [multipart] 

const upload = multer({// here we are creating the [instanse] of the multer for [image , pdf etc]
    dest:'images',// here we are giving the destination where our uploaded file will save. this [images] folder will 
    // automatically create when we will run this file and this folder will create in [task-manager] folder
    // after sending the request file will come in this folder but it will be [binary data] that is 
    // [random generated series of characters]. So if you open it directly then it will give error so to open it
    // we have to add [extension] as orignal file contains
    limits:{// [limits] is an object because it has multiple properties
        fileSize:1000000// it is in bytes so this fileSize is limitrd to [1MB]
    },
    fileFilter(req,file,cb){// this is function to check type of the file ,  whenever a new file is uploaded then 
        // this function will be called .
        // this function will be called internally by multer .
        // in this function there are 3 arguments .
        // (1) [req] that means what request is being made
        // (2) [file] that means information about file being uploaded 
        // (3) [cb] that means [callback] to tell multer when we have done filtering the file

    // [cb] can be used 3 ways

    //    cb(new Error('Please, upload PDF file !'));// if there is any error then [cb] will be called like that

    //    cb(undefined,true); // if upload should  be expected then we will pass first argument as [undefined] and 
    //    second argument will be [true]

    //    cb(undefined,false);// if upload is rejected then we will pass second argument as [false]
         
    //   if(!file.originalname.endsWith('.pdf')){ // [orignalname] means [name of the file on the computer of the user]
    // remember onething in [orignalname] no [camel case]
    //      cb(new Error('Please, upload PDF file !'));
    //   }

    if(!file.originalname.match(/\.(doc|docx)$/)){// [match] allows regular expression inside the forward slashes[//]
        return cb(new Error('Please, upload word file !'));
     }

      cb(undefined,true);

  
    }
})
 
/************ this code is for testing purpose only ***************************************************
const errorMiddleware = (req,res,next)=>{// here we created manually middleware , that we called in route handler, this 
    // function will contain all 3 arguments 
    // Express will know that this function is designed for error handling
    throw new Error('From my middleware');// this error will throw when this middleware will call
}

app.post('/upload', errorMiddleware , (req,res)=>{// [errorMiddleware] is a [manual middleware] like
// [auth middleware] .
// so it will always throw error and if things goes correct also
    res.send();
}, (error, req, res, next)=>{// when error is thrown then this function will call and this function will have [error]
    // argument and and all 3 arguments that we declared in [errorMiddleware] function
    res.status(400).send({error: error.message});// here we are sending [error JSON ] as response
})
*/


app.post('/upload', upload.single('upload'), (req,res)=>{// [upload.single('upload')] is a [multer middleware] like
// [auth middleware] .
// [upload] is [instance] of [multer] that we created and this instance have method [single] , in this method we 
// will pass argument that we will use  as [key] in [URL request] , otherwise [multer] will not filnd it
    res.send();
}, (error, req, res, next)=>{// if error occure according validation that we applied [like size or file type] then this 
    // function will call 
    res.status(400).send({error: error.message});// here we are sending [error JSON] as response
})


/******************************** this is the route how whole flow will work  ***********************************

// when request will be sent then it will go to the route handler => then [upload.single('upload')] middleware will
// run and it will see [single] argument that is [upload] that is [key] and understand which file will be uploaded
// => and it will save this file into destination that is [images] => if all are successful then route handler
// 3rd argument will run and [status 200] will send as response to client .

**************************************************************************************************************/










