import express from 'express';
import debug from 'debug';
import { ObjectId } from 'mongodb';
import currencyConversion from '../data/currencyConversion.js';
import dateConversion from '../data/dateConversion.js';
import expenseModel from '../data/models/expenseModel.js';

const editExpenseRouter = express.Router();
const myDebug = debug('app:editExpenseRouter');

editExpenseRouter.use((req, res, next) => {
    if(req.user){
        next();
    } else {
        res.redirect('/auth/signIn');
    }
});

editExpenseRouter.route('/select').get((req, res) => {

    expenseModel.find( {}, (err, expenses) => {
        if(err) {
            console.log(err);
        } else {
            res.render('selectEditExpense', { expenses });
        }
    });
});

editExpenseRouter.route('/edit').post((req, res) => {
    const id = Object.keys(req.body)[0];

    expenseModel.findOne( { _id: new ObjectId(id) }, (err, expense) => {
        if(err) {
            console.log(err);
        } else {
            res.render('editExpense', { expense });
        }
    });
});



editExpenseRouter.route('/editExecute').post((req, res) => {
    const id = Object.keys(req.body)[0];
    const newValues = Object.values(req.body)[0];

    const newExpenseJSON = {
        Date: dateConversion(newValues[0]),
        Description: newValues[1],
        Amount: newValues[2],
        Currency: newValues[3],
        Amount_INR: Math.round(newValues[2] * currencyConversion(newValues[3]) * 100) / 100
    }

    expenseModel.findOneAndUpdate( { _id: new ObjectId(id) }, newExpenseJSON, (err, data) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/editExpense/select');
        }
    });
});

export default editExpenseRouter;