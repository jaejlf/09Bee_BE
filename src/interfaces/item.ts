import { Document } from "mongoose";

export default interface Item extends Document{
    itemId : number, //기본키값,상품ID,
    title : string, //상품 이름,
    headImg? : string, //대표 이미지 URL,
    tag : [
        string //, ...상품 태그, 설명
    ],
    isMain : boolean, // false일 경우 수요조사, true일 경우 공구모집

    // 수요조사 양식 관련 추가 필요
    preSearch : {
        isHide : boolean, // 공개 여부
        date : string // 일정 xx월xx일까지 이런식으로 string으로 작성
    },

    deleteYN? : boolean, // 메인 페이지 삭제 여부,
    lobbyID : number, // 총대 id
    dobbyIDs : [ number ], // 총원들 id
    lobbyAlarm : [ string ], // 러비에게 가는 알람
    dobbyAlarm : [ string ], // 더비에게 가는 알람
    // 글 내용
    content : [{
        img? : string, // img url
        text? : string // 내용
    }],
    companyInfo : {
        registerNum : string, // 등록 번호
        companyName : string, // 상호명
        sellerName : string,  // 판매자 성명
        address : string, // 소재지
        type : string, // 업태
        typeEvent : string // 종목
    },
    targetNum : {
        minNum : number, // 최소 인원
        maxNum : number, // 최대 인원
        currentNum : number // 현재 인원
    },
    progress : number, // 0 : 수요조사 진행 1 : 수요조사 마감, 2 : 공구 모집 진행, 3 : 공구 모집 마감, 4 : 주문 진행, 5 : 배송 시작, 6: 배송 마감
    notice : [
        string // 공지사항
    ],
    price : {
        maxPrice : number, //최소 인원 달성 시 가격
        minPrice : number //최대 인원 달성 시 가격
    },
    date : {
        surveyStart : string, //수요조사 시작 날짜
        surveyEnd : string, //수요조사 끝 날짜
        recruitStart : string, //공구모집 시작 날짜
        recruitEnd : string //공구모집 끝 날짜
    }
}