import express from 'express';
import debug from 'debug';
import { MongoClient } from 'mongodb';

const adminRouter = express.Router();

const myDebug = debug('app:adminRouter');

const sessions = [
    {
       "id":84473,
       "title":"Secure Programming for the Enterprise",
       "description":"Est sunt nostrud officia fugiat sunt reprehenderit cupidatat. Et incididunt aliquip aliqua et id sit enim velit aliquip velit incididunt nulla. Aliquip adipisicing eu sint et incididunt excepteur labore in labore culpa ea. Incididunt aute labore aute duis adipisicing officia consequat. Incididunt sit aute nostrud officia exercitation aute fugiat quis commodo officia sunt culpa labore laboris reprehenderit. Commodo eu non reprehenderit. Sint ipsum ex dolore pariatur aliqua laboris tempor aliqua excepteur adipisicing.\nExcepteur ex et veniam adipisicing eu et. Deserunt non laborum proident. Exercitation sint do irure ut eiusmod incididunt non. Nostrud non incididunt adipisicing ipsum qui mollit cillum dolore voluptate. Occaecat officia incididunt in duis.\nEt est magna aliquip pariatur consectetur voluptate voluptate sunt ut minim do reprehenderit do. Ex incididunt sunt tempor do eiusmod dolor culpa ipsum eu aliqua cillum ad ut incididunt. Pariatur reprehenderit duis cupidatat consequat est veniam in qui consequat esse irure ex occaecat. Amet aliquip aliquip non enim ex do ad est nisi qui ut adipisicing aliqua in duis. Adipisicing Lorem ut do deserunt ipsum nulla labore Lorem ullamco.",
       "startsAt":"8:00",
       "endsAt":"5:00",
       "speakers":[
          {
             "id":"2bda8276-b7b6-4653-a7c5-1bcc59d11a49",
             "name":"Jean Ryan"
          }
       ],
       "room":"Europa",
       "day":"Wednesday",
       "format":"FullDay Workshop",
       "track":".NET",
       "level":"Intermediate"
    },
    {
       "id":84375,
       "title":"Automation: A Deep Dive into Jenkins",
       "description":"Veniam dolore deserunt amet exercitation aute aliqua dolore eiusmod ipsum. Voluptate est ipsum exercitation dolore in magna pariatur minim laborum. Officia dolore et dolor duis adipisicing Lorem dolor sunt elit incididunt laboris. Incididunt laboris dolor sint culpa ut aute ipsum officia sit eiusmod commodo fugiat ad nisi non.\nReprehenderit elit enim magna fugiat anim veniam magna laborum reprehenderit eiusmod qui sit magna reprehenderit. Laboris excepteur duis eu dolor deserunt occaecat et. Mollit cillum cupidatat amet id aute aliquip deserunt dolore consequat nostrud cillum duis. Labore ipsum reprehenderit mollit non esse do dolor magna labore. Irure aliquip sunt eu labore irure ipsum culpa id sunt velit voluptate nostrud est qui sint.",
       "startsAt":"8:00",
       "endsAt":"5:00",
       "speakers":[
          {
             "id":"8f3683fe-0760-487b-8a9d-9fbebfaf6bc7",
             "name":"Brandy Terry"
          }
       ],
       "room":"Saturn",
       "day":"Wednesday",
       "format":"FullDay Workshop",
       "track":"DevOps",
       "level":"Advanced"
    },
    {
       "id":80310,
       "title":"Build a DevOps Pipeline for .NET Apps",
       "description":"Dolor occaecat excepteur Lorem. Sit ut magna cupidatat et minim incididunt fugiat in. Cupidatat sint dolore irure qui esse. Aliqua aute consequat eu ex id Lorem irure. Amet excepteur qui do eu anim. Adipisicing voluptate consectetur commodo ex. Aliquip excepteur aliqua do ea ea ad labore magna pariatur ex. Ex ex in ullamco Lorem.\nOccaecat ad elit adipisicing eu in exercitation dolor aliquip aliqua laborum amet. Labore nostrud enim dolor anim ad. Ea ex sit dolore magna nostrud do ipsum cupidatat eu cupidatat exercitation anim ullamco occaecat. Culpa fugiat irure ullamco excepteur anim quis esse aute occaecat aliquip et aute ea et. Eu esse ut dolor mollit tempor anim ipsum dolor. Do adipisicing commodo mollit amet nostrud. Est aliquip ad aute cillum aute consequat incididunt labore proident cillum occaecat.",
       "startsAt":"8:00",
       "endsAt":"5:00",
       "speakers":[
          {
             "id":"e2187bee-02a6-492b-9706-452f5748f473",
             "name":"Erik Peters"
          }
       ],
       "room":"Sol",
       "day":"Wednesday",
       "format":"FullDay Workshop",
       "track":".NET",
       "level":"Advanced"
    },
    {
       "id":79874,
       "title":"A.I. powered robots",
       "description":"Pariatur officia excepteur ad magna incididunt ullamco magna nulla laborum laboris fugiat duis laboris. Excepteur laborum pariatur labore pariatur. Nulla duis nisi dolor sit cupidatat dolore duis cillum sint dolor. Consequat aute excepteur qui sint voluptate tempor veniam consectetur ipsum officia minim. Est ea in in ipsum amet ex adipisicing laborum. Ea adipisicing enim velit excepteur ullamco veniam quis do consectetur aute adipisicing officia. Minim laborum officia cupidatat occaecat mollit incididunt duis mollit.\nQui cupidatat anim ex velit consequat enim nostrud sunt ad nostrud eu in irure culpa non. Voluptate officia excepteur duis in magna commodo. Magna elit quis duis minim sint sunt quis magna anim sint eu adipisicing. Fugiat sint aliqua elit excepteur nisi. Magna eiusmod laborum deserunt officia mollit quis labore eiusmod do. In deserunt esse nisi tempor tempor reprehenderit Lorem magna. Culpa magna adipisicing ullamco occaecat est ut ex.\nProident veniam in elit officia incididunt elit nostrud ea pariatur adipisicing sunt esse et. Ipsum ea duis eiusmod excepteur magna laborum irure ex consectetur veniam reprehenderit. Aute culpa quis et quis occaecat in incididunt. Tempor adipisicing commodo cillum elit cupidatat voluptate ut cillum. Amet sunt voluptate amet excepteur Lorem consectetur reprehenderit officia dolore ad elit sit Lorem consequat. Ea quis est sunt incididunt id ipsum laborum. Quis sunt laborum aute.",
       "startsAt":"8:00",
       "endsAt":"5:00",
       "speakers":[
          {
             "id":"36a25c2a-4204-42f0-9ba8-d7b9c6f67226",
             "name":"Bowie Graves"
          }
       ],
       "room":"Jupiter",
       "day":"Wednesday",
       "format":"FullDay Workshop",
       "track":"Data",
       "level":"Introductory and overview"
    }
];

adminRouter.route('/')
    .get((req, res) => {
        const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
        const dbName = 'expensesApp';

        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);
                myDebug('Connected correctly to the server');

                const db = client.db(dbName);

                const response = await db.collection('sessions').insertMany(sessions);
                res.json(response);

            } catch(err) {
                myDebug(err.stack);
            }

            client.close();
        }());
    });

export default adminRouter;