import express from 'express';
import debug from 'debug';
import multer from 'multer';
import expenseModel from '../data/models/expenseModel.js';
import csv from 'csvtojson';
import currencyConversion from '../data/currencyConversion.js';
import dateConversion from '../data/dateConversion.js';

const csvUploadRouter = express.Router();
const myDebug = debug('app:authRouter');

let storage = multer.diskStorage({  
    destination:(req,file,cb)=>{  
    cb(null,'./public/uploads');  
    },  
    filename:(req,file,cb)=>{  
    cb(null,file.originalname);  
    }  
    });  

let uploads = multer({storage:storage});

csvUploadRouter.get('/',(req,res)=>{  
    expenseModel.find((err,expenses)=>{  
        if(err){  
            res.redirect('/home.html');
            console.log(err);  
        } else {  
            if(expenses!=''){  
                res.render('csvUpload',{ expenses });  
            } else{
                //res.render('index',{data:''});
                res.redirect('/home.html');
            }  
        }  
    });  
});

var temp ;  
csvUploadRouter.post('/',uploads.single('csv'),(req,res)=>{
    //convert csvfile to jsonArray     
    csv()  
        .fromFile(req.file.path)
        .then((jsonObj)=>{  

            for(let x=0;x<jsonObj.length;x++){  
                temp = parseFloat(jsonObj[x].Amount);  
                jsonObj[x].Amount = temp;
                jsonObj[x].Amount_INR = Math.round(temp * currencyConversion(jsonObj[x].Currency) * 100) / 100;
                temp = dateConversion(jsonObj[x].Date);
                jsonObj[x].Date = temp;  
            }

            console.log(jsonObj);
            //insertmany is used to save bulk data in database.
            //saving the data in collection(table)
            expenseModel.insertMany(jsonObj,(err,data)=>{  
                if(err){  
                    console.log(err);  
                } else { 
                    res.redirect('/home.html');  
                }  
            });  
        });  
});  

export default csvUploadRouter;