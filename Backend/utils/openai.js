import "dotenv/config";

const getOpenAIAPIResponce = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", 
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    })
  };

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", options);
    const data = await response.json();

    // Return only the AI's reply
    return data.choices[0].message.content;
  } catch (err) {
    console.error("OpenAI API error:", err);
    throw new Error("Failed to fetch response from OpenAI");
  }
};

export default getOpenAIAPIResponce;
