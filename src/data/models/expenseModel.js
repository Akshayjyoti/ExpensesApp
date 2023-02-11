import mongoose from "mongoose";
   
var csvSchema = new mongoose.Schema({  
    Date:{  
        type:String  
    },  
    Description:{  
        type:String  
    },  
    Amount:{  
        type:Number  
    },  
    Currency:{  
        type:String 
    }
});  
   
let expenseModel = mongoose.model('expenses',csvSchema);

export default expenseModel;