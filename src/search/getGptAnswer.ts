const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;

export async function getGptAnswer(prompt: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPEN_AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.5,
    }),
  });

  const data = await response.json();
  return data.choices[0]?.message?.content;
}
