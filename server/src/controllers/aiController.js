const Chat = require("../models/Chat");
const generateResponse = require("../services/aiServices");



const getAIResponse = async (req, res) => {
  try {
    console.log("========== AI API CALLED ==========");
    console.log("Request Body:", req.body);
    const { chatId, prompt } = req.body;

    console.log("Received Chat ID:", chatId);
     console.log("Received Prompt:", prompt);

    if (!chatId || !prompt) {
      return res.status(400).json({
        success: false,
        message: "Chat ID and Prompt are required",
      });
    }

    // Find Chat
    const chat = await Chat.findById(chatId);

     console.log("Found Chat:", chat);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Save User Message
    chat.messages.push({
      role: "user",
      content: prompt,
    });

    // Auto title on first message
if (chat.title === "New Chat" && chat.messages.length === 1) {
  chat.title = prompt
    .trim()
    .replace(/\s+/g, " ")
    .substring(0, 35);

  if (prompt.length > 35) {
    chat.title += "...";
  }
}
    

    console.log("User message added");

    // Generate AI Response
    const markdownPrompt = `
Respond ONLY in proper Markdown.

Use:
- # for headings
- ## for subheadings
- - for bullet points
- \`\`\`cpp for C++ code
- Tables whenever useful

User Question:
${prompt}
`;

const aiResponse = await generateResponse(markdownPrompt);

    console.log("AI Response:", aiResponse);

    console.log("------------------");
console.log(aiResponse);
console.log("------------------");

    // Save AI Message
    chat.messages.push({
      role: "assistant",
      content: aiResponse,
    });

    console.log("AI message added");

    await chat.save();

    console.log("Chat saved");

    res.status(200).json({
      success: true,
      response: aiResponse,
      chat,
    });

  } catch (error) {
  console.error("========== AI ERROR ==========");
  console.error("Message:", error.message);
  console.error("Status:", error.status);
  console.error("Stack:", error.stack);

  res.status(500).json({
    success: false,
    message: error.message || "Something went wrong",
  });
}
};

module.exports = {
  getAIResponse,
};