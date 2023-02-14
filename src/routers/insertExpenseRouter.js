import express from 'express';
import debug from 'debug';
import { MongoClient, ObjectId } from 'mongodb';
import currencyConversion from '../data/currencyConversion.js';

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
    const {Date, Description, Amount_Str, Currency} = req.body;

    const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
    const dbName = 'expensesApp';

    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(url);
            const db = client.db(dbName);

            let Amount = parseFloat(Amount_Str);
            let Amount_INR = Math.round(Amount * currencyConversion(Currency) * 100) / 100;

            const newExpense = {Date, Description, Amount, Currency, Amount_INR};
            const results = await db.collection('expenses').insertOne(newExpense);

            console.log(newExpense);
            console.log(results);

            res.redirect('/home.html');

        } catch(err) {
            myDebug(err.stack);
        }

        client.close();
    }());
});

export default insertExpenseRouter;