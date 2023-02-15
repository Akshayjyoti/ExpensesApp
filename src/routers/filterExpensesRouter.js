import express from 'express';
import debug from 'debug';
import dateConversion from '../data/dateConversion.js';
import expenseModel from '../data/models/expenseModel.js';

const filterExpensesRouter = express.Router();
const myDebug = debug('app:filterExpensesRouter');

filterExpensesRouter.use((req, res, next) => {
    if(req.user){
        next();
    } else {
        res.redirect('/auth/signIn');
    }
});

filterExpensesRouter.route('/date').post((req, res) => {
    const {gtDate_Str, ltDate_Str} = req.body;

    const gtDate = dateConversion(gtDate_Str);
    const ltDate = dateConversion(ltDate_Str);

    expenseModel.find( { Date : { $gt :  gtDate, $lt : ltDate} }, (err, expenses) => {
        if(err) {
            console.log(err);
        } else {
            res.render('filterExpenses', { expenses });
        }
    });
});

filterExpensesRouter.route('/amount').post((req, res) => {
    const {gtAmount_Str, ltAmount_Str} = req.body;

    const gtAmount = parseFloat(gtAmount_Str);
    const ltAmount = parseFloat(ltAmount_Str);

    expenseModel.find( { Amount_INR : { $gt :  gtAmount, $lt : ltAmount} }, (err, expenses) => {
        if(err) {
            console.log(err);
        } else {
            res.render('filterExpenses', { expenses });
        }
    });
});

export default filterExpensesRouter;