import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid or missing message" });
  }

  try {
    const apiKey = process.env.AIMLAPI_KEY;

    const response = await fetch("https://api.aimlapi.com/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-3n-e4b-it",
        messages: [{ role: "user", content: message }],
        max_tokens: 100,
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return res.status(500).json({ error: "AI API call failed" });
    }

    return res.status(200).json({ response: data?.choices?.[0]?.message?.content?.trim() });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}
