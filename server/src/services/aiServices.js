const Groq = require("groq-sdk");

console.log("GROQ KEY EXISTS:", !!process.env.GROQ_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateResponse = async (prompt) => {
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

    console.log("Groq response received");

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = generateResponse;