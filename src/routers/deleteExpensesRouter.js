import express from 'express';
import debug from 'debug';
import chalk from 'chalk';
import { MongoClient, ObjectId } from 'mongodb';

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
    const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
    const dbName = 'expensesApp';

    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(url);
            myDebug(chalk.green('Connected correctly to the server'));

            const db = client.db(dbName);

            const expenses = await db.collection('expenses').find().toArray();
            res.render('deleteExpenses', { expenses });

        } catch(err) {
            myDebug(err.stack);
        }

        client.close();
    }());
});

deleteExpensesRouter.route('/').post((req, res) => {
    const keys = Object.keys(req.body);
    console.log(keys);

    const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
    const dbName = 'expensesApp';

    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(url);
            const db = client.db(dbName);

            for(let x = 0; x < keys.length; x++){
                const results = await db.collection('expenses').deleteOne({ _id : new ObjectId(keys[x])});
                console.log(results);
            }
            
            res.redirect('/home.html');

        } catch(err) {
            myDebug(err.stack);
        }

        client.close();
    }());
});

export default deleteExpensesRouter;