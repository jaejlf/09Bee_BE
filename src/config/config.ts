// 환경변수 미리 선언
require('dotenv').config();

const mongo_url = process.env.MONGODB_URL;
const google_client = process.env.GOOGLE_CLIENT;
const google_password = process.env.GOOGLE_PASSWORD;

const config = {
    mongoURL : mongo_url,
    googleID : google_client,
    googlePW : google_password
}

export default config;