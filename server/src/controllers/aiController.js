const Chat = require("../models/Chat");
const generateResponse = require("../services/aiServices");

const getAIResponse = async (req, res) => {
  try {
    console.log("========== AI API CALLED ==========");

    const { chatId, prompt } = req.body;

    console.log("Chat ID:", chatId);
    console.log("Prompt:", prompt);

    // Validate request
    if (!chatId || !prompt?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Chat ID and Prompt are required",
      });
    }

    // Find chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    console.log("Chat found:", chat._id);

    // Make sure messages exists
    if (!Array.isArray(chat.messages)) {
      chat.messages = [];
    }

    // Save user message
    chat.messages.push({
      role: "user",
      content: prompt.trim(),
    });

    // Set title for first message
    if (
      (!chat.title || chat.title === "New Chat") &&
      chat.messages.length === 1
    ) {
      chat.title = prompt
        .trim()
        .replace(/\s+/g, " ")
        .substring(0, 35);

      if (prompt.trim().length > 35) {
        chat.title += "...";
      }
    }

    // AI prompt
    const markdownPrompt = `
You are a helpful AI coding assistant.

Respond in proper Markdown.

Use:
- # for headings
- ## for subheadings
- bullet points where useful
- code blocks with the correct language
- tables whenever useful

User Question:
${prompt.trim()}
`;

    console.log("Calling Groq...");

    // Generate AI response
    const aiResponse = await generateResponse(markdownPrompt);

    console.log("Groq response received");

    // Save AI message
    chat.messages.push({
      role: "assistant",
      content: aiResponse,
    });

    // Save chat
    await chat.save();

    console.log("Chat saved successfully");

    return res.status(200).json({
      success: true,
      response: aiResponse,
      chat,
    });

  } catch (error) {
    console.error("========== AI CONTROLLER ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "AI generation failed",
    });
  }
};

module.exports = {
  getAIResponse,
};