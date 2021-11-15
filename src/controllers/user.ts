import User from '../models/user'
import { userType } from "../interfaces/user";
import config from '../config/config';
import passport from 'passport';
import getNextSequence from './counter';
var GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function (app : any) {

    //strategy에서 받은 정보들을 user에 입력
    passport.serializeUser((user: any, done: any) => {
        return done(null, user.id);
    });

    //serializeUser에서 분해한 user._id로부터 원래 user값들을 다시 바인딩
    passport.deserializeUser((id: string, done: any) => {
        User.findById(id, (err: Error, doc: userType) => {
            return done(null, doc);
        })
    });

    passport.use(new GoogleStrategy({
        clientID: config.googleID,
        clientSecret: config.googlePW,
        callbackURL: "/user/auth/google/callback"
    },

    function(accessToken : any, refreshToken : any, profile : any, cb : any) {        
        User.findOne({ email: profile.emails[0].value }, async (err: Error, doc: userType) => {
            if (err) return cb(err, null);
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

    return passport;
}