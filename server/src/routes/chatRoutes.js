const express = require("express");

const router = express.Router();

const { createChat, getUserChats, getChat,deleteChat, renameChat,} = require("../controllers/chatController");

router.post("/create", createChat);
router.get("/user/:userId", getUserChats);
router.get("/:chatId", getChat);
router.delete("/:chatId", deleteChat);
router.put("/:chatId/rename", renameChat);


module.exports = router;