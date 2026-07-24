const Chat = require("../models/Chat");

// Create Chat
const createChat = async (req, res) => {
  try {
    const { userId } = req.body;

    const chat = await Chat.create({
      user: userId,
      messages: [],
    });

    return res.status(201).json(chat);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    return res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get all chats of a user
const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({ user: userId }).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      chats,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    await Chat.findByIdAndDelete(chatId);

    return res.status(200).json({
      success: true,
      message: "Chat Deleted",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const renameChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { title },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    return res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createChat,
  getChat,
  getUserChats,
  deleteChat,
  renameChat,
};