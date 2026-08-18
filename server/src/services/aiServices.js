const generateResponse = async (prompt) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing");
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
         model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_completion_tokens: 500,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API Error:", data);

      throw new Error(
        data?.error?.message || `Groq API failed with status ${response.status}`
      );
    }

    const answer = data?.choices?.[0]?.message?.content;

    if (!answer) {
      throw new Error("Groq returned an empty response");
    }

    return answer;

  } catch (error) {
    console.error("AI SERVICE ERROR:", error.message);
    throw error;
  }
};

module.exports = generateResponse;