import express from 'express';
import debug from 'debug';
import currencyConversion from '../data/currencyConversion.js';
import dateConversion from '../data/dateConversion.js';
import expenseModel from '../data/models/expenseModel.js';

const insertExpenseRouter = express.Router();
const myDebug = debug('app:insertExpenseRouter');

insertExpenseRouter.use((req, res, next) => {
    if(req.user){
        next();
    } else {
        res.redirect('/auth/signIn');
    }
});

insertExpenseRouter.route('/').post((req, res) => {
    const {Date_Str, Description, Amount_Str, Currency} = req.body;

    let Date = dateConversion(Date_Str);
    let Amount = parseFloat(Amount_Str);
    let Amount_INR = Math.round(Amount * currencyConversion(Currency) * 100) / 100;
    const newExpense = {Date, Description, Amount, Currency, Amount_INR};

    expenseModel.create( newExpense, (err, data) => {
        if(err){  
            console.log(err);  
        } else { 
            res.redirect('/home.html');  
        }
    });
});

export default insertExpenseRouter;