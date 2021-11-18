import mongoose, { Schema } from "mongoose";
import Item from "../interfaces/item";

const itemSchema: Schema = new Schema({
    itemId: { type: Number, required: true },
    title: { type: String, required: true },
    headImg: { type: String, required: true },
    tag: [
        { type: String, required: true }//, ...상품 태그, 설명
    ],
    isMain: { type: Boolean, required: true },
    // 수요조사 양식 관련 추가 필요
    preSearch : {
        isHide : { type: Boolean, required: true }, // 공개 여부
        date : { type: String, required: true } // 일정 xx월xx일까지 이런식으로 string으로 작성
    },

    deleteYN : { type: Boolean, required: true }, // 메인 페이지 삭제 여부,
    lobbyID : { type: Number, required: true }, // 총대 id
    dobbyIDs : [ { type: Number, required: true } ], // 총원들 id
    // 글 내용
    content : [{
        img : { type: String, required: true }, // img url
        text : { type: String, required: true } // 내용
    }],
    companyInfo : {
        registerNum : { type: String, required: true }, // 등록 번호
        companyName : { type: String, required: true }, // 상호명
        sellerName : { type: String, required: true },  // 판매자 성명
        address : { type: String, required: true },  // 소재지
        type : { type: String, required: true }, // 업태
        typeEvent : { type: String, required: true } // 종목
    },
    targetNum : {
        minNum : { type: Number, required: true }, // 최소 인원
        maxNum : { type: Number, required: true }, // 최대 인원
        currentNum : { type: Number, required: true } // 현재 인원
    },
    progress : { type: Number, required: true }, // 0 : 수요조사 진행 1 : 수요조사 마감, 2 : 공구 모집 진행, 3 : 공구 모집 마감, 4 : 주문 진행, 5 : 배송 시작
    notice : [
        { type: String, required: true } // 공지사항
    ]
})

export default mongoose.model<Item>("Item", itemSchema)