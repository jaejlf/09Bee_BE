import express from "express";
import itemController from "../controllers/item";

const router = express.Router()

router.get("/:itemId", itemController.getItem); // 개별 아이템 API
router.get("/dobbyIn/:userId", itemController.dobbyIn); // 더비 공동구매 참여
router.get("/progress/:progressId", itemController.changeProgress); // 러비 마감 상태 변경 등 공구 진행 상태 변경API
router.post("/notice", itemController.makeNotice); // 러비 공지사항 작성

export = router;