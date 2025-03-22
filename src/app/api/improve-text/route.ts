import { NextResponse } from "next/server";
import { env } from "~/env";

interface RequestBody {
  text: string;
  field: string;
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
    const { text, field } = body;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Define field-specific system prompts
    const fieldPrompts = {
      title:
        "You are improving a course title. Make it clear, engaging, and professional while keeping it concise. Focus on the key subject and value proposition.",
      shortDescription:
        "You are improving a course short description that appears in listings (max 150 characters). Make it compelling and informative while being concise.",
      description:
        "You are improving a full course description. Structure it well, highlight key learning outcomes, and maintain a professional tone while being engaging.",
    };

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                fieldPrompts[field as keyof typeof fieldPrompts] ||
                "Improve the given text to make it more formal, clear, and grammatically correct while maintaining its educational value.only provide what is asked no extra words",
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 1,
          max_completion_tokens: 1024,
          top_p: 1,
          stream: false,
          stop: null,
        }),
      },
    );

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
