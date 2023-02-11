import express from 'express';
import debug from 'debug';
import chalk from 'chalk';
import { MongoClient, ObjectId } from 'mongodb';
// import sessions from '../data/sessions.json' assert { type: "json" };

const sessionsRouter = express.Router();
const myDebug = debug('app:sessionsRouter');

sessionsRouter.use((req, res, next) => {
    if(req.user){
        next();
    } else {
        res.redirect('/auth/signIn');
    }
});

sessionsRouter.route('/').get((req, res) => {
    const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
    const dbName = 'expensesApp';

    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(url);
            myDebug(chalk.green('Connected correctly to the server'));

            const db = client.db(dbName);

            const sessions = await db.collection('sessions').find().toArray();
            res.render('sessions', { sessions });

        } catch(err) {
            myDebug(err.stack);
        }

        client.close();
    }());
});

sessionsRouter.route('/:id').get((req, res) => {
    const id = req.params.id;
    const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
        const dbName = 'expensesApp';

        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);
                myDebug(chalk.green('Connected correctly to the server'));

                const db = client.db(dbName);

                const session = await db.collection('sessions').findOne({ _id: new ObjectId(id)});
                
                res.render('session', {
                    session
                });

            } catch(err) {
                myDebug(err.stack);
            }

            client.close();
        }());
});

export default sessionsRouter;