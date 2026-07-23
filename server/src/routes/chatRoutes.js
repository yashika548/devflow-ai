const express = require("express");

const router = express.Router();

const { createChat, getUserChats, getChat,deleteChat,} = require("../controllers/chatController");

router.post("/create", createChat);
router.get("/user/:userId", getUserChats);
router.get("/:chatId", getChat);
router.delete("/:chatId", deleteChat);


module.exports = router;