import { NextFunction, Request, Response } from "express";
import Item from "../models/item";

const getItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const itemId = parseInt(req.params.itemId);
        const item = await Item.findOne({ itemId: itemId });
        const exportItem = {
            "itemId": item?.itemId,
            "title": item?.title,
            "headImg": item?.headImg,
            "tag": item?.tag,
            "isMain": item?.isMain,
            "preSearch": item?.preSearch,
            "deleteYN": item?.deleteYN,
            "lobbyID": item?.lobbyID,
            "dobbyIDs": item?.dobbyIDs,
            "content": item?.content,
            "companyInfo": item?.companyInfo,
            "targetNum": item?.targetNum,
            "progress": item?.progress,
            "notice": item?.notice,
            "price" : item?.price,
            "date" : item?.date
        }
        res.status(200).json({
            item: exportItem
        })        
    }
    catch (error : any) {
        res.status(500).json({
            error: error.message
        })
    }
}

// itemId로 item정보 찾기
const itemFindOne = async (id: number) => {
    try {
        return await Item.findOne(
            { itemId: id })
    }
    catch (error : any) {
        console.log("itemFindOne" + error.message)
    }
}

// item update (Set)
const itemFindUpdateSet = async (id: number, param: any) => {
    try {
        return await Item.findOneAndUpdate(
            { itemId: id },
            { $set: param },
            { new: true })
    }
    catch (error : any) {
        console.log("itemFindUpdate" + error.message)
    }
}

// item update (Inc)
const itemFindUpdateInc = async (id: number, param: any) => {
    try {
        return await Item.findOneAndUpdate(
            { itemId: id },
            { $inc: param },
            { new: true })
    }
    catch (error : any) {
        console.log("itemFindUpdate" + error.message)
    }
}

// 더비 공구 신청 시
const dobbyIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.userId);
        const itemId: any = req.query.itemId;
        const foundItemInfo: any = await itemFindOne(itemId); // 아이템 api 데이터 가져옴
        if (foundItemInfo === null || foundItemInfo === undefined) {
            res.status(501).json({
                error: "해당 itemId에 맞는 item이 없습니다."
            })
        } else if(foundItemInfo.targetNum.currentNum < foundItemInfo.targetNum.maxNum) { // 현재 인원 < 최대인원일시 배열에 추가하여 update
            const dobbyIDs: Array<number> = foundItemInfo.dobbyIDs; // 업데이트할 배열 선언
            // dobbyIDs 배열 뒤에 userId붙이기
            dobbyIDs.push(userId);
            // db에 업데이트
            await itemFindUpdateSet( itemId, { dobbyIDs : dobbyIDs });

            // currentNum ++시키기
            await itemFindUpdateInc( itemId, { "targetNum.currentNum" : 1 });          

            // 모집 인원 달성 시 && 알람 비어 있을 시 충족 멘트 lobbyAlarm에 추가
            if(foundItemInfo.targetNum.minNum <= foundItemInfo.targetNum.currentNum && foundItemInfo.lobbyAlarm.length === 0){
                const lobbyAlarms: Array<string> = foundItemInfo.lobbyAlarm; // 업데이트할 배열 선언
                const addAlarm : string = "진행 중인 '" + foundItemInfo.title + "'의 공구모집 최소 인원이 충족되었습니다. 주문을 진행해보세요!";
                lobbyAlarms.push(addAlarm);
                await itemFindUpdateSet( itemId, { lobbyAlarm : lobbyAlarms });                
            }

            res.status(200).json({
                result: true
            })
        }    
    }
    catch (error : any) {
        res.status(500).json({
            error: error.message
        })
    }
}

// 프로그레스(진행 과정) 변경 시
const changeProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const progressId = parseInt(req.params.progressId);
        const itemId: any = req.query.itemId;
        const foundItemInfo: any = await itemFindOne(itemId); // 아이템 api 데이터 가져옴
        if (foundItemInfo === null || foundItemInfo === undefined) {
            res.status(501).json({
                error: "해당 itemId에 맞는 item이 없습니다."
            })
        } else{ 
            // db에 업데이트
            await itemFindUpdateSet( itemId, { progress : progressId });          
            
            // 공구 모집 마감 시 더비에게 알람
            if(progressId === 3){
                const dobbyAlarms: Array<string> = foundItemInfo.dobbyAlarm; // 업데이트할 배열 선언
                const addAlarm : string = "참여 중인 '" + foundItemInfo.title + "'의 공구모집 공구 모집이 종료되었습니다. 확인해보세요";
                dobbyAlarms.push(addAlarm);
                await itemFindUpdateSet( itemId, { dobbyAlarm : dobbyAlarms });  
            }

            res.status(200).json({
                progress: progressId
            })
        }    
    }
    catch (error : any) {
        res.status(500).json({
            error: error.message
        })
    }
}

// 공지사항 작성
const makeNotice = async (req : Request, res : Response, next : NextFunction) => {
    try {
        let { itemId, notice } = req.body;
        const foundItemInfo: any = await itemFindOne(itemId); // 아이템 api 데이터 가져옴
        if (foundItemInfo === null || foundItemInfo === undefined) {
            res.status(501).json({
                message: "해당 itemId에 맞는 item이 없습니다."
            })
        } else {
                const notices: Array<string> = foundItemInfo.notice; // 업데이트할 배열 선언
                // notice 배열 뒤에 새 공지사항 붙이기
                notices.push(notice);
                // db에 업데이트
                await itemFindUpdateSet( itemId, { notice: notices });

                // 공지사항 작성 시 더비에게 알람
                const dobbyAlarms: Array<string> = foundItemInfo.dobbyAlarm; // 업데이트할 배열 선언
                const addAlarm : string = "참여 중인 '" + foundItemInfo.title + "'의 새로운 공지사항이 업로드되었습니다. 공지사항을 확인해보세요!";
                dobbyAlarms.push(addAlarm);
                await itemFindUpdateSet( itemId, { dobbyAlarm : dobbyAlarms });                              

                res.status(200).json({
                    result: "공지사항 등록 완료"
                })
            }
        }    
    catch (error : any) {
        res.status(500).json({
            message: error.message
        })
    }
}

export default {
    getItem,
    dobbyIn,
    changeProgress,
    makeNotice
};
