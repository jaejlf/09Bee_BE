import express from 'express';
import config from './config/config'; // 환경변수 가져옴
import mongoose from 'mongoose';
import passportModule from 'passport';
import session from 'express-session';
import itemRoutes from "./routes/item"
import ConnectMongoDBSession from "connect-mongodb-session";

const app = express();
app.use(express.json());

app.set("trust proxy", 1); // trust proxy 역방향 프록시 지원 활성화

const mongoURL = config.mongoURL || "";

export var db: any;

// 몽구스 연결
mongoose
  .connect(mongoURL, {
  })
  .then(() => {
    console.log("connected MongoDB")
  })
  .catch((error) => {
    console.log(error.message)
  })

//세션 저장을 위해 몽고db에 로그인
const MongoDBStore = ConnectMongoDBSession(session);
const mongoDBStore = new MongoDBStore({
  uri: mongoURL,
  databaseName: '09bee',
  collection: "sessions"
})

mongoDBStore.on("error", () => {
  // Error 처리
})

var cors = require('cors');
app.use(cors());
app.use(cors({ origin: true, credentials: true }));

// cors 지정
app.use((req: any, res: any, next: any) => {
  const corsWhitelist = [
    'https://localhost:8080',
    'https://localhost:3000',
    'http://localhost:8080',
    'https://gonggoo-bee.herokuapp.com/',
    'https://frontend-nine-black.vercel.app/',
    '*',
  ]
  if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token')
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', "GET, POST, OPTION, PUT, PATCH, DELETE");
  }

  next();
})

//세션 설정
app.use(
  session({
    secret: "secretcode",
    // 모든 request마다 기존에 있던 session에 아무런 변경사항이 없을 시에도 그 session을 다시 저장하는 옵션
    // (매 request 마다 세션을 계속 다시 저장하는 것)
    resave: false,
    // request가 들어오면 해당 request에서 새로 생성된 session에 아무런 작업이 이루어지지 않은 상황 
    // false -> 아무런 작업이 이루워지지 않은 경우 저장 X
    saveUninitialized: false,
    store: mongoDBStore, //세션을 데이터베이스에 저장
    cookie: {
      sameSite: "none",
      secure: true,
      // 모든 범위에서 이 쿠키 사용 가능 "/"
      // default일 경우 쿠키가 생성된 해당 페이지에서만 가능
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 만료시간 One Week
    }
  }))

//passport 실행
app.use(passportModule.initialize());
app.use(passportModule.session());

//app을 인자로 보내서 passport를 return 값으로 받음
var passport = require('./controllers/user')(app) // 받은 passport를 passort라는 변수에 저장
var userRoutes = require('./routes/user')(passport) //import가 아닌 require 함수로 가져옴


// 라우터별로 실행 함수 지정
app.use("/user", userRoutes);
app.use("/item", itemRoutes);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello');
});

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const error = new Error("Not Found")
    res.status(404).json({
      message: error.message,
    })
  }
)

var port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Started server with ' + port);
});