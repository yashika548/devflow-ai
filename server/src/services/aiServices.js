const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateResponse = async (prompt) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }

  if (!prompt || !prompt.trim()) {
    throw new Error("Prompt is empty");
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion?.choices?.[0]?.message?.content;

    if (!response) {
      throw new Error("Empty response received from Groq");
    }

    return response;
  } catch (error) {
    console.error("GROQ ERROR:", error);

    throw new Error(
      error?.error?.message ||
      error?.message ||
      "Groq API failed"
    );
  }
};

module.exports = generateResponse;