// 환경변수 미리 선언
require('dotenv').config();

const mongo_url = process.env.MONGODB_URL;

let config = {
    mongoURL : mongo_url
}

export default config;

/*
import dotenv from 'dotenv';
import _ from 'lodash';

const envFound : any = dotenv.config();

let config : any = envFound.parsed;

if (!('error' in envFound)) {
    config = envFound.parsed
} else {
    config = {}
    _.each(process.env, (value, key : any) => envFound[key] = value)
}

const mongo_url = process.env.MONGODB_URL;

const MONGO = {
    url: mongo_url
}

export default config;
*/