const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

/***********************  it was the coding challenge  to create task *************************************/

/******* this route hadler does not contain [async await] **************************************************

router.post('/tasks',(req,res)=>{
    const task = new Task(req.body);
    task.save().then(()=>{
        res.status(201).send(task);// status [201] means [task is created successfully]
    }).catch((e)=>{
        res.status(400).send(e);
    })

})

*/

/*********  here we are using [async await] in rout handler ***********************************************/

router.post('/tasks', auth,  async (req,res)=>{// here we will call [auth] function so that we can monitor which 
    // user created this task sothat only that user can delete the task 
    try{
        // const task = new Task(req.body);// this is old code when there was no relationship between [Task model]
        // and [User model]
        const task = new Task({// here we are passing object 
            ...req.body,// this is [ES6 spread operator] that will copy all properties of [req.body] into the 
            // passing object
            owner:req.user._id// and in this object we will add [owner] property that will add [id] of the [loged in]
            // user . Actually when client sends request to create task at that time [user id] willnot be in this JSON
            // so here we will manually give the [loged in user id] and then task will be created with [user id] 
        })
        await task.save();
        res.status(201).send(task);
    }catch(e){
      res.status(500).send(e);
    }
})

/**************it is coding challenge to read all tasks ****************************************************************/

/** ** this route hadler does not contain [async await] **************************************************

router.get('/tasks',(req,res)=>{
    Task.find({}).then((tasks)=>{
        res.send(tasks);
    }).catch((e)=>{
        res.status(500).send();
    })

})

*/

/*********  here we are using [async await] in rout handler ***********************************************/

// GET /tasks?completed=true
// that means in this route handler we will take [completed] value from the URL,
// if [true] then all tasks that have [completed] value as [true] will show and [viseversa]. if completed have
// no value in URL then all tasks will be shown .
// we are doing [filtering] in this route handler because this route handler returns an array of tasks

// GET /tasks?limit=10&skip=1 
// here we are applying [pagination] , [limit] means in one page [10] tasks will be shown , [skip] means [1] task will
// skip that means [skip] is used for [iteration]

// GET /tasks?sortBy=createdAt:desc // here we are using [:] in place of this we can use any special character

// here we are doing [sorting] , in URL we will use [sortBy] and for decreament [desc] and increment [asc] will use

router.get('/tasks', auth ,  async (req,res)=>{// [auth] function will be called here sothat current user document
    // will save into [req.user] , and user will be authorized.
    const match = {};// this is empty object see below codes you will understand the use, actually if there is 
    // no value of [completed] then this empty object will print all tasks

    const sort = {};// this is empty object see below codes you will understand the use, actually if there is 
    // no value of [sortBy] then this empty object will print all tasks as normal
    try{
    
    
    if(req.query.completed){// if [completed] has value in URL
        match.completed = req.query.completed === 'true';// here we are settting the value of [completed] that
        // present in URL but problem is it will be string value not boolean . So this statement [req.query.completed === 'true'] 
        // will return [boolean true] is it is [string true] and viseversa .
    }

    if(req.query.sortBy){// if there is [sortBy] value in URL
        const parts = req.query.sortBy.split(':');// here we are doing splitting 
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 ; // {parts[0]} will have what property client sent like 
        //[createdAt or completed etc] , this property will be set in [sort] object , as a value of [sort's property]
        // we have to use [-1 for decrement] and [1 for increment]
    }

    //   const tasks = await Task.find({});// it is commented because we want that only task that is related to 
    // current user should come

    // const tasks = await Task.find({owner:req.user._id});// here only task that is related to the loged in user 
    // will come but we have another way also that we will use 

    // res.send(tasks);

    // await req.user.populate('tasks').execPopulate();// here only task that is related to the loged in 
    //user will come , to apply [filter] we have to comment this statement . below statement will work

    await req.user.populate({
        path:'tasks',// here we will give  [virtual field] name that is created in [User model]

        // match:{// this object will contains the property that we want to apply in filtering 
        //     completed:false// here we are manually setting , those tasks should be fetched that has [completed = false]
        // }

        match,// this is [short hand syntex] that means actual is [match:match] and in [match] object we set that 
        // property from [URL]

        options:{// [options] is used for pagination and sorting 
            //limit:2// here we are setting [limit] manually

            limit:parseInt(req.query.limit),// here we hare taking [limit] value from [URL] but it will be string 
            // so we are parsing in [Integer] . if [limit] value is not in [URL] or [can't be parsed into integer]
            // then mongoose will ignore it.
            skip:parseInt(req.query.skip),

            // sort:{// here we are setting object  value manually
            //    //createdAt:1
            //    completed:-1// [-1] means  [true] will come first and [1] means [false] will come first
            // }

            sort// this is [short hand syntex] that means actual is [sort:sort] and in [sort] object we set that 
            // property from [URL]
        }
    }).execPopulate();
    res.send(req.user.tasks);
    }catch(e){
        res.status(500).send();
    }
})

/************ it is coding challenge to read one task  ************************************************************/

/** ** this route hadler does not contain [async await] **************************************************

router.get('/tasks/:id',(req,res)=>{
    const _id = req.params.id;
    Task.findById(_id).then((task)=>{
        if(!task){
            return res.status(404).send();
        }
            res.send(task);
    }).catch((e)=>{
        res.status(500).send();
    })
})

*/

/*********  here we are using [async await] in rout handler ***********************************************/

router.get('/tasks/:id', auth , async (req,res)=>{// [auth] function will be called here sothat current user document
    // will save into [req.user] , and user will be authorized.
    const  _id = req.params.id;
    try{
    //    const task = await Task.findById(_id);// it is commented because we want that only task that is related to 
    // current user should come

    const task = await Task.findOne({_id, owner:req.user._id});// here only task that is related to the loged in user will come
       if(!task){
         return res.status(401).send();
       }
       res.send(task);
    }catch(e){
        res.status(500).send();
    }
})

/*** here we are updating task and it is a coding challenge ****************************************************/

router.patch('/tasks/:id', auth , async (req,res)=>{// [auth] function will be called here sothat current user document
    // will save into [req.user] , and user will be authorized.
    const updates = Object.keys(req.body);// [keys] will give an array of strings that contains [properties] of the 
    // object that client sent
   
    //console.log(`update = ${updates}`);// this was for testing purpose
     const allowedUpdates = ['description', 'completed'];// here we are creating an array of the properties that 
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

        // const  task = await Task.findById(req.params.id);// it is commented because we want that only task that is related to 
    // current user should come

        const  task = await Task.findOne({_id:req.params.id , owner:req.user._id});// here only task that is related to the loged in user will come

        if(!task){
            return res.status(404).send();
        }

        updates.forEach((update)=> task[update] = req.body[update]);
        await task.save();


         //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{ new:true, runValidators:true});
         
         res.send(task);

     }catch(e){
        res.status(500).send();
     }
})

/******************** here we are deleting task and it was coding challenge *******************************/

router.delete('/tasks/:id', auth , async (req,res)=>{// [auth] function will be called here sothat current user document
    // will save into [req.user] , and user will be authorized.

    try{
     // const task = await Task.findByIdAndDelete(req.params.id);// it is commented because we want that only task that is related to 
    // current user should come
        const task = await Task.findOneAndDelete({_id:req.params.id , owner:req.user._id});// here only task that is related to the loged in user will come

        if(!task){
           return res.status(404).send();
        }
      res.send(task);
    }catch(e){
        res.status(500).send();
    }
    
})

module.exports = router;














