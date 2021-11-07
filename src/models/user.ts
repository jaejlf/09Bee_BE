// 스키마 작성
import mongoose from 'mongoose';
import { userType } from '../interfaces/user';
import moment from "../controllers/moment";

const user = new mongoose.Schema({
    provider: {
        required : false,
        type : String
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
    }
})

user.pre('save', function (this: userType) {
    this.createdAt = moment.nowDateTime();
    console.log(this.createdAt)
})

export default mongoose.model("User", user);