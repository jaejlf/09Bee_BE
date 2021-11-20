import express from "express";
import { userType } from '../interfaces/user';
var router = express.Router();

module.exports = function (passport : any) {
    //구글 로그인을 위해 /google로 이동
    router.get('/auth/google',
        passport.authenticate('google', { scope: ['email', 'profile'] }));

    //구글 로그인 후 홈페이지(/)로 이동
    router.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/user/login', session : true }),
        function (req: any, res: any) {
            console.log('login success');
            console.log(req.user);
<<<<<<< HEAD
            res.redirect("https://frontend-nine-black.vercel.app/");
=======
            //res.redirect("https://frontend-d7zm62vth-1thefull-project.vercel.app/");
            res.redirect("https://frontend-cu8jbdk41-1thefull-project.vercel.app/");
>>>>>>> 4bd6df20799aea876080a591a131c8ccabfe7df1
        });

    //홈페이지(/)
    router.get('/', (req: any, res: any) => {
        /*
        if(req.user) console.log(req.user);
        else console.log('req x');
        if(res.user) console.log(res.user);
        else console.log('res x')
        */
        const temp = getPage(req.user);
        res.send(temp);
    });

    router.get("/getuser", (req, res) => {
        res.send(req.user);
    });

    //로그아웃
    router.get('/auth/logout', function (req: any, res: any) {
        req.logout();
        // 쿠키 제거
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.send('logout done');
        });
    });

    //임시 페이지
    const getPage = (user: userType) => {
        if (user !== undefined) {
            return `
        <a href="/user/auth/logout">logout</a>
        <h2>${user.name}님 환영합니다!</h2>
        <h3>로그인 이메일 : ${user.email} </h3>
        `;
        }
        else {
            return `
        <a href="/user/auth/google">Google Login</a>
        `;
        }
    }
    return router;
}