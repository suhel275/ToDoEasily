const mongoose = require('mongoose');// here we are importing the [mongoose] module, mongodb should run in other
// terminal
const validator = require('validator');

const taskSchema = new mongoose.Schema({
    description:{
       type:String,
       required:true,
       trim:true
    },
    completed:{
        type:Boolean,
        default:false

    },
    owner:{// this field is created so that we can create relation between [User model] and [Task model] . here if any
        // task is created then which user is loged in in this time this used id will be stored in the [Task model]
        type:mongoose.Schema.Types.ObjectId,// this line will give data type of the objectId
        required:true,// that means if any task is created then user id will definatelly stored
        ref:'User'// this is [reference] and we will give [model name 'User] here that means if we print 
        //[task.owner] then it will not only print id of the user 
        // if will print whole document of this user that is present in [User model]
        // it will save into database
    }

},{
    timestamps:true// this is mongoose feature , it will track that when task is [created] and when task is [modified],
    // bydefauls [timestamps] value is [false]
})
 
const Task = mongoose.model('Task',taskSchema)

module.exports = Task;

