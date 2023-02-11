import express from 'express';
import chalk from 'chalk';
import debug from 'debug';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import sessionsRouter from './src/routers/sessionsRouter.js';
import adminRouter from './src/routers/adminRouter.js';
import authRouter from './src/routers/authRouter.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passportConfig from './src/config/passport.js';

// imports for csv upload
import mongoose from 'mongoose';
import multer from 'multer';
import expenseModel from './src/data/models/expenseModel.js';
import csv from 'csvtojson';
import viewExpensesRouter from './src/routers/viewExpensesRouter.js';


const PORT = process.env.PORT || 3000;
const app = express();
const myDebug = debug('app');

// code for csv upload start
var storage = multer.diskStorage({  
    destination:(req,file,cb)=>{  
    cb(null,'./public/uploads');  
    },  
    filename:(req,file,cb)=>{  
    cb(null,file.originalname);  
    }  
    });  
var uploads = multer({storage:storage});

const url = 'mongodb://127.0.0.1:27017/expensesApp?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
// const dbName = 'expensesApp';

mongoose.connect(url,
    {useNewUrlParser:true})  
    .then(()=>console.log('connected to db'))  
    .catch((err)=>console.log(err));

app.get('/csvSubmit',(req,res)=>{  
    expenseModel.find((err,expenses)=>{  
        if(err){  
            res.redirect('/home.html');
            console.log(err);  
        } else {  
            if(expenses!=''){  
                res.render('demo',{ expenses });  
            } else{
                //res.render('index',{data:''});
                res.redirect('/home.html');
            }  
        }  
    });  
});

var temp ;  
app.post('/',uploads.single('csv'),(req,res)=>{
    //convert csvfile to jsonArray     
    csv()  
        .fromFile(req.file.path)
        .then((jsonObj)=>{  
            console.log(jsonObj);

            for(var x=0;x<jsonObj;x++){  
                temp = parseFloat(jsonObj[x].Amount)  
                jsonObj[x].Amount = temp;
                // temp = new Date(sonObj[x].Date);
                // jsonObj[x].Date = temp;  
            } 
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

// code for csv upload end

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'expenses',
    resave: true,
    saveUninitialized: true
}));
passportConfig(app);

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/sessions', sessionsRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use('/expenses', viewExpensesRouter);
//app.use('/csvSubmit', csvUploadRouter);

app.get('/',(req, res) => {
    res.render('index', {
        title: 'Expenses',
        data: ['a','b','c']
    });
})

app.listen(PORT, () => {
    myDebug(`Listening on port ${chalk.green(PORT)}`);
})
