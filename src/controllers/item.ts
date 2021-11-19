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

export default {
    getItem
};
