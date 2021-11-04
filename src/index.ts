import express from 'express';
import config from './config/config'; // 환경변수 가져옴

const app = express();
app.use(express.json());

app.set("trust proxy", 1); // trust proxy 역방향 프록시 지원 활성화

const MongoClient = require('mongodb').MongoClient;
const mongoURL = config.mongoURL;

export var db: any;
MongoClient.connect( mongoURL, { useUnifiedTopology: true }, function (err: any, client: any) {
    if (err) {
        console.log('Failed to connect to MongoDB', err);
        return;
    }
    db = client.db('09bee');
    console.log('connected to MongoDB');
})

app.use('/', require('./routes/user'));

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello');
});

app.listen(8080, () => {
    console.log('Started server with 8080');
});