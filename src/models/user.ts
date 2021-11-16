// 스키마 작성
import mongoose from 'mongoose';
import { userType } from '../interfaces/user';
import moment from "../controllers/moment";

const user = new mongoose.Schema({
    googleId: {
        required: false,
        type: String
    },
    userId: {
        required: false,
        type: Number
    },  
    name: {
        required : false,
        type : String
    },
    email: {
        required : false,
        type : String
    },
    phone: {
        required : false,
        type : String
    },
    createdAt: {
        required: false,
        type: String
    }    
})

// save전 현재 시간 출력
user.pre('save', function (this: userType) {
    this.createdAt = moment.nowDateTime();
    console.log(this.createdAt)
})

export default mongoose.model("User", user);