require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const mongoURL = process.env.MONGODB_URL;

export var db: any;
export const connectMongoDB = MongoClient.connect(mongoURL, { useUnifiedTopology: true }, function (err: any, client: any) {
    if (err) {
        console.log('Failed to connect to MongoDB', err);
        return;
    }
    db = client.db('09bee');
    console.log('connected to MongoDB');
})