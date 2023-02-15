import express from 'express';
import debug from 'debug';
import { ObjectId } from 'mongodb';
import expenseModel from '../data/models/expenseModel.js';

const deleteExpensesRouter = express.Router();
const myDebug = debug('app:deleteExpensesRouter');

deleteExpensesRouter.use((req, res, next) => {
    if(req.user){
        next();
    } else {
        res.redirect('/auth/signIn');
    }
});

deleteExpensesRouter.route('/').get((req, res) => {

    expenseModel.find( {}, (err, expenses) => {
        if(err) {
            console.log(err);
        } else {
            res.render('deleteExpenses', { expenses });
        }
    });
});

deleteExpensesRouter.route('/').post((req, res) => {

    const keys = Object.keys(req.body);

    for(let x = 0; x < keys.length; x++){
        expenseModel.deleteOne({ _id : new ObjectId(keys[x])}, (err, data) => {
            if(err){
                console.log(err);
            }
        });
    }

    res.redirect('/deleteExpenses');

});

export default deleteExpensesRouter;