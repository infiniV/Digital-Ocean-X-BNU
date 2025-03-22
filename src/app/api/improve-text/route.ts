import { NextResponse } from "next/server";
import { env } from "~/env";

interface RequestBody {
  text: string;
}

interface GroqMessage {
  role: "system" | "user";
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface GroqErrorResponse {
  error: {
    message: string;
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const response = await fetch("https://api.groq.com/v1/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content:
              "You are a professional text improvement assistant. Improve the given text to make it more formal, clear, and grammatically correct while maintaining its educational value. Only return the improved text without any additional commentary.",
          },
          {
            role: "user",
            content: text,
          },
        ] as GroqMessage[],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as GroqErrorResponse;
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to improve text" },
        { status: response.status },
      );
    }

    const data = (await response.json()) as GroqResponse;

    if (!data.choices?.[0]?.message?.content) {
      return NextResponse.json(
        { error: "Invalid response from GROQ API" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      improvedText: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error improving text:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
