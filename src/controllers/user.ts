import User from '../models/user'
import { userType } from "../interfaces/user";
import config from '../config/config';
import passport from 'passport';
import getNextSequence from './counter';
var GoogleStrategy = require('passport-google-oauth20').Strategy
//const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function (app : any) {

    //strategy에서 받은 정보들을 user에 입력
    passport.serializeUser((user: any, done: any) => {
        // console.log('serializeUser', user)
        return done(null, user.id);
    });

    //serializeUser에서 분해한 user._id로부터 원래 user값들을 다시 바인딩
    passport.deserializeUser((id: string, done: any) => {
        // console.log('deserializeUser', id)
        User.findById(id, (err: Error, doc: userType) => {
            return done(null, doc);
        })
    });

    passport.use(new GoogleStrategy({
        clientID: config.googleID,
        clientSecret: config.googlePW,
        callbackURL: "http://localhost:8080/auth/google/callback"
    },

    function(accessToken : any, refreshToken : any, profile : any, cb : any) {
        //console.log(profile);
        
        User.findOne({ email: profile.emails[0].value }, async (err: Error, doc: userType) => {
            if (err) return cb(err, null);
            //console.log('doc');
            //console.log(doc);
            try {
                // 새로운 유저
                if (!doc) {
                    console.log('신규 유저');
                    const userId: any = await getNextSequence("userInfo");
                    const newUser = new User({
                        googleID : profile.id,
                        provider: profile.provider,
                        name: profile.displayName,
                        email: profile.emails[0].value
                    })
                    await newUser.save().then((savedUser : any) => {
                    })
                    .catch((err : any) => {
                        console.log(err);
                    })
                    return cb(null, newUser);
                }
                // 기존 유저
                //if(doc) console.log(doc);
                else{ 
                    console.log('기존 유저');
                    return cb(null, doc);
                }

            } catch (error) {
                console.log('error');
                return cb(error);
            }
            })
        }))


/*
        passport.serializeUser(function (user: any, done: any) {
            done(null, user);
        });
        passport.deserializeUser(function (user: userType, done: any) {
            done(null, user);
        });
*/     
    return passport;
}
/*
require('dotenv').config();

var express = require('express');
var session = require('express-session');
var router = express.Router();
var passport = require('passport')
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

import { db } from '../index';
import { userType } from '../interfaces/user';

//MIDDLEWARE
router.use(express.urlencoded({ extended: false }));
router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

//PASSPORT 세팅
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user: userType, done: any) {
    done(null, user);
});
passport.deserializeUser(function (user: userType, done: any) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT,
    clientSecret: process.env.GOOGLE_PASSWORD,
    callbackURL: "http://localhost:8080/auth/google/callback"
},
    function (accessToken: any, refreshToken: any, profile: any, done: any) {

        var user = db.collection('login').findOne({ email: profile.emails[0].value }, function (err: Error, result: userType) {
            user = {
                provider: profile.provider,
                name: profile.displayName,
                email: profile.emails[0].value
            }
            console.log(user);
            //console.log(result);    

            if (!result) {
                db.collection('login').insertOne({ provider: user.provider, name: user.name, email: user.email }, function (err: Error, result: any) {
                    console.log("새로운 유저 :: 정보 저장 완료");
                });
            }
            else {
                db.collection('login').updateOne({ email: user.email }, { $set: { provider: user.provider, name: user.name } }, function (err: Error, result: any) {
                    console.log("기존 유저 :: 정보 업데이트 완료");
                });
            }

            done(null, user)
        });
    }
));

//구글 로그인을 위해 /google로 이동
router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }));


//구글 로그인 후 홈페이지(/)로 이동
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    function (req: any, res: any) {
        res.redirect('/');
    });

//홈페이지(/)
router.get('/', (req: any, res: any) => {
    const temp = getPage(req.user);
    res.send(temp);
});

//로그아웃
router.get('/auth/logout', function (req: any, res: any) {
    req.logout();
    res.redirect('/');
});

//임시 페이지
const getPage = (user: userType) => {
    if (user !== undefined) {
        console.log(user);
        return `
      <a href="/auth/logout">logout</a>
      <h2>${user.name}님 환영합니다!</h2>
      <h3>로그인 이메일 : ${user.email} </h3>
    `;
    }
    else {
        return `
      <a href="/auth/google">Google Login</a>
    `;
    }
}

module.exports = router;
*/