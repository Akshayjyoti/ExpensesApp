import express from 'express';
import debug from 'debug';
import { MongoClient, ObjectId } from 'mongodb';
import dateConversion from '../data/dateConversion.js';

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

    const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
    const dbName = 'expensesApp';

    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(url);
            const db = client.db(dbName);

            const gtDate = dateConversion(gtDate_Str);
            const ltDate = dateConversion(ltDate_Str);

            const expenses = await db.collection('expenses').find({ Date : { $gt :  gtDate, $lt : ltDate}}).toArray();

            console.log(expenses);

            res.render('csvUpload', { expenses });

        } catch(err) {
            myDebug(err.stack);
        }

        client.close();
    }());
});

filterExpensesRouter.route('/amount').post((req, res) => {
    const {gtAmount_Str, ltAmount_Str} = req.body;

    const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
    const dbName = 'expensesApp';

    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(url);
            const db = client.db(dbName);

            const gtAmount = parseFloat(gtAmount_Str);
            const ltAmount = parseFloat(ltAmount_Str);

            const expenses = await db.collection('expenses').find({ Amount_INR : { $gt :  gtAmount, $lt : ltAmount}}).toArray();

            console.log(expenses);

            res.render('csvUpload', { expenses });

        } catch(err) {
            myDebug(err.stack);
        }

        client.close();
    }());
});

export default filterExpensesRouter;