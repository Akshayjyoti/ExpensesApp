import passport from 'passport';
import { Strategy } from 'passport-local';
import { MongoClient, ObjectId } from 'mongodb';

// function localStrategy(){
//     passport.use(new Strategy({
//         usernameField: 'username',
//         passwordField: 'password'
//     }, (username, password, done) => {
//         const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
//         const dbName = 'expensesApp';
//         (async function validateUser(){
//             let client;
//             try {
//                 client = await MongoClient.connect(url);
//                 myDebug(chalk.green('Connected correctly to the server'));

//                 const db = client.db(dbName);

//                 const user = await db.collection('users').findOne({username});
                
//                 if(user && user.password === password){
//                     done(null, user);
//                 } else {
//                     done(null, false);
//                 }

//             } catch(err) {
//                 done(err, false);
//             }

//             client.close();
//         }());
//     }));
// }

// export default localStrategy;

const localStrategy = new Strategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
        const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
        const dbName = 'expensesApp';
        (async function validateUser(){
            let client;
            try {
                client = await MongoClient.connect(url);

                const db = client.db(dbName);

                const user = await db.collection('users').findOne({username});
                
                if(user && user.password === password){
                    done(null, user);
                } else {
                    done(null, false);
                }

            } catch(err) {
                done(err, false);
            }

            client.close();
        }());
    });

export default localStrategy;