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
            await itemFindUpdateSet( itemId, { dobbyIDs: dobbyIDs });

            // currentNum ++시키기
            await itemFindUpdateInc( itemId, { "targetNum.currentNum" : 1 });            

            // to do : 모집 인원 달성 시 lobbyAlarm에 추가

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

// 프로그레스 변경 시
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
            await itemFindUpdateSet( itemId, { progress: progressId });           

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

export default {
    getItem,
    dobbyIn,
    changeProgress
};
