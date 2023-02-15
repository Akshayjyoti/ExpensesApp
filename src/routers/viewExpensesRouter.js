import express from 'express';
import debug from 'debug';
import expenseModel from '../data/models/expenseModel.js';

const viewExpensesRouter = express.Router();
const myDebug = debug('app:viewExpensesRouter');

viewExpensesRouter.use((req, res, next) => {
    if(req.user){
        next();
    } else {
        res.redirect('/auth/signIn');
    }
});

viewExpensesRouter.route('/').get((req, res) => {

    expenseModel.find( {}, (err, expenses) => {
        if(err) {
            console.log(err);
        } else {
            // console.log(data);
            res.render('csvUpload', { expenses });
        }
    });
});

export default viewExpensesRouter;