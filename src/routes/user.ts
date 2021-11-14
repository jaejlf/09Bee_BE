import express from "express";
import { userType } from '../interfaces/user';
var router = express.Router();
/*
var passport = require('passport')
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
*/
module.exports = function (passport : any) {

    var userData = {
        googleID : "",
        provider: "",
        name: "",
        email: ""
    };
    
    //구글 로그인을 위해 /google로 이동
    router.get('/auth/google',
        passport.authenticate('google', { scope: ['email', 'profile'] }));

    //구글 로그인 후 홈페이지(/)로 이동
    router.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/auth/login', session : true }),
        function (req: any, res: any) {
            console.log('login success');
            console.log(req.user);

            userData = req.user; // userData에 넣어서 data 넘김
            //res.send(req.user);
            res.redirect('/');
        });

    //홈페이지(/)
    router.get('/', (req: any, res: any) => {
        //console.log(req);
        if(req.user) console.log(req.user);
        else console.log('req x');
        if(res.user) console.log(res.user);
        else console.log('res x')
        //const temp = getPage(req.user);
        const temp = getPage(userData);
        res.send(temp);
    });

    router.get("/getuser", (req, res) => {
        res.send(req.user);
    });

    //로그 아웃
    router.get('/auth/logout', function (req: any, res: any) {        
        //console.log(req.session.cookie);
        req.logout();
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.send('logout done');
        });
        
    });

    //임시 페이지
    const getPage = (user: userType) => {
        //if (user !== undefined) {
        if (user.provider !== "") {
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
    return router;
}