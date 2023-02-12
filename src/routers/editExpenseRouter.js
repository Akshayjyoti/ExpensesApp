import express from 'express';
import debug from 'debug';
import chalk from 'chalk';
import { MongoClient, ObjectId } from 'mongodb';
import currencyConversion from '../data/currencyConversion.js';

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
    const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
    const dbName = 'expensesApp';

    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(url);
            myDebug(chalk.green('Connected correctly to the server'));

            const db = client.db(dbName);

            const expenses = await db.collection('expenses').find().toArray();
            res.render('selectEditExpense', { expenses });

        } catch(err) {
            myDebug(err.stack);
        }

        client.close();
    }());
});

editExpenseRouter.route('/edit').post((req, res) => {
    const id = Object.keys(req.body)[0];
    const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
    const dbName = 'expensesApp';

    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(url);
            myDebug(chalk.green('Connected correctly to the server'));

            const db = client.db(dbName);

            const expense = await db.collection('expenses').findOne({ _id: new ObjectId(id)});
            res.render('editExpense', { expense });

        } catch(err) {
            myDebug(err.stack);
        }

        client.close();
    }());
});



editExpenseRouter.route('/editExecute').post((req, res) => {
    const id = Object.keys(req.body)[0];
    const newValues = Object.values(req.body)[0];

    const newExpenseJSON = {
        Date: newValues[0],
        Description: newValues[1],
        Amount: newValues[2],
        Currency: newValues[3],
        Amount_INR: Math.round(newValues[2] * currencyConversion(newValues[3]) * 100) / 100
    }

    const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
    const dbName = 'expensesApp';

    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(url);
            const db = client.db(dbName);
            
            const results = await db.collection('expenses').updateOne({ _id : new ObjectId(id)}, { $set: newExpenseJSON});
            
            console.log(results);
            
            res.redirect('/editExpense/select');

        } catch(err) {
            myDebug(err.stack);
        }

        client.close();
    }());
});

export default editExpenseRouter;