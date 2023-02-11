import express from 'express';
import debug from 'debug';
import chalk from 'chalk';
import { MongoClient, ObjectId } from 'mongodb';
// import sessions from '../data/sessions.json' assert { type: "json" };

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
    const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
    const dbName = 'expensesApp';

    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(url);
            myDebug(chalk.green('Connected correctly to the server'));

            const db = client.db(dbName);

            const expenses = await db.collection('expenses').find().toArray();
            res.render('demo', { expenses });

        } catch(err) {
            myDebug(err.stack);
        }

        client.close();
    }());
});

export default viewExpensesRouter;