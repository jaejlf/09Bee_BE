import { NextFunction, Request, Response } from "express";
import Item from "../models/item";
import userController from "./userinfo"; // 유저 관련 함수 사용하기 위해 호출

// itemId로 item정보 찾기
const itemFindOne = async (id: number) => {
    try {
        return await Item.findOne(
            { itemId: id })
    }
    catch (error: any) {
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
    catch (error: any) {
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
    catch (error: any) {
        console.log("itemFindUpdate" + error.message)
    }
}

// item 정보 가져오기
const getItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const itemId = parseInt(req.params.itemId);
        const item = await itemFindOne(itemId);
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
            "price": item?.price,
            "date": item?.date,
            "formData": item?.formData
        }
        res.status(200).json(
            exportItem
        )
    }
    catch (error: any) {
        res.status(500).json({
            error: error.message
        })
    }
}

// 전체 item 리턴
const getAllItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allItems = await Item.find({})
        res.status(200).json({
            itemInfo: allItems
        })

    }
    catch (error: any) {
        res.status(500).json({
            error: error.message
        })
    }
}

// 더비 공구 신청 시
const dobbyIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.userId);
        const itemId: any = req.query.itemId;

        const foundItemInfo: any = await itemFindOne(itemId); // 아이템 api 데이터 가져옴
        const foundUserInfo: any = await userController.userFindOne(userId); // 유저 api 데이터 가져옴

        if (foundItemInfo === null || foundItemInfo === undefined) {
            res.status(501).json({
                error: "해당 itemId에 맞는 item이 없습니다."
            })
        }
        else if (foundUserInfo === null || foundUserInfo === undefined) {
            res.status(502).json({
                error: "해당 userId에 맞는 user가 없습니다."
            })
        }
        else if (foundItemInfo.targetNum.currentNum < foundItemInfo.targetNum.maxNum) { // 현재 인원 < 최대인원일시 배열에 추가하여 update
            const dobbyIDs: Array<number> = foundItemInfo.dobbyIDs; // 업데이트할 배열 선언
            
            dobbyIDs.push(userId); // dobbyIDs 배열 뒤에 userId붙이기            
            await itemFindUpdateSet(itemId, { dobbyIDs: dobbyIDs }); // db에 업데이트            
            await itemFindUpdateInc(itemId, { "targetNum.currentNum": 1 }); // currentNum ++시키기

            const lobbyId = foundItemInfo.lobbyID;
            const foundLobbyInfo: any = await userController.userFindOne(lobbyId); // 러비 api 데이터 가져옴
            // 모집 인원 달성 시 && 러비 알람 비어 있을 시 충족 멘트 lobbyAlarm에 추가
            if (foundItemInfo.targetNum.minNum <= foundItemInfo.targetNum.currentNum && foundLobbyInfo.lobbyAlarm.length === 0) {
                const lobbyAlarms: Array<object> = foundLobbyInfo.lobbyAlarm; // 업데이트할 배열 선언

                const addAlarm: string = "진행 중인 '" + foundItemInfo.title + "'의 공구모집 최소 인원이 충족되었습니다. 주문을 진행해보세요!";
                const addObject: object = {
                    itemId: itemId,
                    content: addAlarm
                };
                lobbyAlarms.push(addObject);
                await userController.userFindUpdate(lobbyId, { lobbyAlarm: lobbyAlarms }); // 유저 db 알람에 추가
            }
            res.status(200).json({
                result: true
            })
        }
    }
    catch (error: any) {
        res.status(500).json({
            error: error.message
        })
    }
}

// 참여 더비 리스트 확인
const getDobbyList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const itemId = parseInt(req.params.itemId);
        const foundItemInfo: any = await itemFindOne(itemId); // 아이템 api 데이터 가져옴
        const formDataList: Array<any> = foundItemInfo.formData; // 더비가 제출한 폼 정보 오브젝트 가져옴

        let i = 0;
        var exportDobbysInfo: Array<any> = [];
        formDataList.forEach(async function (form: any) {
            const foundUserInfo: any = await userController.userFindOne(form.userId); // 유저 api 데이터 가져옴
            const options = foundItemInfo.title + ", " + "색상: " + form.color + " / " + "수량: " + form.ea + "개"; // 주문 상세내용 문자열 연결

            if (foundUserInfo === null || foundUserInfo === undefined) {
                res.status(502).json({
                    error: "해당 userId에 맞는 user가 없습니다."
                })
            }
            else {
                //공구 인원에 따른 개당 가격
                let ea_price = (foundItemInfo.targetNum.maxNum <= foundItemInfo.targetNum.currentNum) ? foundItemInfo.price.minPrice : foundItemInfo.price.maxPrice;

                //배열에 참여 더비 정보 추가
                const dobbyInfo = {
                    "name": foundUserInfo.name,
                    "option": options,
                    "address": foundUserInfo.address,
                    "phone": foundUserInfo.phone,
                    "orderPrice": ea_price * form.ea,
                    "payPrice": ea_price * form.ea + 2000
                }
                exportDobbysInfo.push(dobbyInfo);

                i++;
                if (i == formDataList.length) { //반복문 종료 전, 참여 더비 정보 배열 response
                    res.status(200).json({
                        dobbyList: exportDobbysInfo
                    })
                }
            }
        });
    }
    catch (error: any) {
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
        const dobbyList: Array<number> = foundItemInfo.dobbyIDs; // 더비들 id를 배열로 선언

        if (foundItemInfo === null || foundItemInfo === undefined) {
            res.status(501).json({
                error: "해당 itemId에 맞는 item이 없습니다."
            })
        } else {
            // db에 업데이트
            await itemFindUpdateSet(itemId, { progress: progressId });

            // 공구 모집 마감 시 더비에게 알람
            if (progressId === 3) {
                // 더비 리스트를 한바퀴 돌면서 각각의 userDB에 알람 채워줌
                dobbyList.forEach(async function (userId: number) {
                    const foundUserInfo: any = await userController.userFindOne(userId); // 유저 api 데이터 가져옴
                    if (foundUserInfo === null || foundUserInfo === undefined) {
                        res.status(502).json({
                            error: "해당 userId에 맞는 user가 없습니다."
                        })
                    }
                    else {
                        const dobbyAlarms: Array<object> = foundUserInfo.dobbyAlarm; // 업데이트할 배열 선언
                        const addAlarm: string = "참여 중인 '" + foundItemInfo.title + "'의 공구 모집이 종료되었습니다. 확인해보세요";
                        const addObject: object = {
                            itemId: itemId,
                            content: addAlarm
                        };
                        dobbyAlarms.push(addObject);
                        userController.userFindUpdate(userId, { dobbyAlarm: dobbyAlarms });
                    }
                });
            }
            res.status(200).json({
                progress: progressId
            })
        }
    }
    catch (error: any) {
        res.status(500).json({
            error: error.message
        })
    }
}

// 공지사항 작성
const makeNotice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { itemId, notice } = req.body;
        const foundItemInfo: any = await itemFindOne(itemId); // 아이템 api 데이터 가져옴
        const dobbyList: Array<number> = foundItemInfo.dobbyIDs; // 더비들 id를 배열로 선언

        if (foundItemInfo === null || foundItemInfo === undefined) {
            res.status(501).json({
                message: "해당 itemId에 맞는 item이 없습니다."
            })
        } else {
            const notices: Array<string> = foundItemInfo.notice; // 업데이트할 배열 선언
            // notice 배열 뒤에 새 공지사항 붙이기
            notices.push(notice);

            // db에 업데이트
            await itemFindUpdateSet(itemId, { notice: notices });

            // 더비 리스트를 한바퀴 돌면서 각각의 userDB에 알람 채워줌
            dobbyList.forEach(async function (userId: number) {
                const foundUserInfo: any = await userController.userFindOne(userId); // 유저 api 데이터 가져옴
                if (foundUserInfo === null || foundUserInfo === undefined) {
                    res.status(502).json({
                        error: "해당 userId에 맞는 user가 없습니다."
                    })
                }
                else {
                    const dobbyAlarms: Array<object> = foundUserInfo.dobbyAlarm; // 업데이트할 배열 선언
                    const addAlarm: string = "참여 중인 '" + foundItemInfo.title + "'의 새로운 공지사항이 업로드되었습니다. 공지사항을 확인해보세요!";
                    const addObject: object = {
                        itemId: itemId,
                        content: addAlarm
                    };
                    dobbyAlarms.push(addObject);
                    userController.userFindUpdate(userId, { dobbyAlarm: dobbyAlarms });
                }
            });


            res.status(200).json({
                result: "공지사항 등록 완료"
            })
        }
    }
    catch (error: any) {
        res.status(500).json({
            message: error.message
        })
    }
}

// 공동구매 폼 작성 버튼 클릭
const submitForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { itemId, color, size, ea, userId } = req.body;
        const foundItemInfo: any = await itemFindOne(itemId); // 아이템 api 데이터 가져옴
        if (foundItemInfo === null || foundItemInfo === undefined) {
            res.status(501).json({
                message: "해당 itemId에 맞는 item이 없습니다."
            })
        } else {
            // db 업데이트
            await Item.findOneAndUpdate(
                { itemId: itemId },
                { $push: { formData: { color: color, size: size, ea: ea, userId: userId } } },
                { new: true })

            res.status(200).json({
                result: "주문 정보 등록 완료"
            })
        }
    }
    catch (error: any) {
        res.status(500).json({
            message: error.message
        })
    }
}

export default {
    getItem,
    dobbyIn,
    changeProgress,
    makeNotice,
    getDobbyList,
    getAllItem,
    submitForm
};