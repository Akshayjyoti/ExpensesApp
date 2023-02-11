import express from 'express';
import debug from 'debug';
import { MongoClient, ObjectId } from 'mongodb';
import passport from 'passport';
import passportConfig from '../config/passport.js';
import localStrategy from '../config/strategies/local.strategy.js';

const authRouter = express.Router();
const myDebug = debug('app:authRouter');

passportConfig(authRouter);

authRouter.route('/signUp').post((req, res) => {
    const {username, password} = req.body;
    const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
    const dbName = 'expensesApp';

    (async function addUser(){
        let client;
        try {
            client = await MongoClient.connect(url);
            const db = client.db(dbName);
            const user = {username, password};
            const results = await db.collection('users').insertOne(user);
            myDebug(results);
            console.log(results);
            req.login(results.insertedId, () => {
                res.redirect('/auth/profile');
            });

        } catch(error) {
            myDebug(error);
        }

        client.close();
    }());

    
});

authRouter.route('/signIn')
    .get((req, res) => {
        res.render('signIn');
    })
    .post(passport.authenticate(localStrategy, {
        successRedirect: '/home.html',
        failureMessage: '/'
    }));

authRouter.route('/profile').get((req, res) => {
    res.json(req.query);
});

export default authRouter;