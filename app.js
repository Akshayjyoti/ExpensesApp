import express from 'express';
import chalk from 'chalk';
import debug from 'debug';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import authRouter from './src/routers/authRouter.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passportConfig from './src/config/passport.js';
import filterExpensesRouter from './src/routers/filterExpensesRouter.js';

import csvUploadRouter from './src/routers/csvUploadRouter.js';
import viewExpensesRouter from './src/routers/viewExpensesRouter.js';
import insertExpenseRouter from './src/routers/insertExpenseRouter.js';
import deleteExpensesRouter from './src/routers/deleteExpensesRouter.js';
import editExpenseRouter from './src/routers/editExpenseRouter.js';

const PORT = process.env.PORT || 3000;
const app = express();
const myDebug = debug('app');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = 'mongodb://127.0.0.1:27017/expensesApp?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';

mongoose.set('strictQuery', false);

mongoose.connect(url,
    {useNewUrlParser:true})  
    .then(()=>console.log('connected to db'))  
    .catch((err)=>console.log(err));

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

app.use('/auth', authRouter);
app.use('/expenses', viewExpensesRouter);
app.use('/csvSubmit', csvUploadRouter);
app.use('/insertExpense', insertExpenseRouter);
app.use('/deleteExpenses', deleteExpensesRouter);
app.use('/editExpense', editExpenseRouter);
app.use('/filterExpenses', filterExpensesRouter);

app.get('/',(req, res) => {
    res.render('index', {
        title: 'Expenses',
        data: ['a','b','c']
    });
})

app.listen(PORT, () => {
    myDebug(`Listening on port ${chalk.green(PORT)}`);
})
