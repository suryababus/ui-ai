"use server";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, streamText } from "ai";
import { StreamingTextResponse } from "ai";
import { createStreamableValue } from "ai/rsc";

import { RateLimiterMemory } from "rate-limiter-flexible";
import { headers } from "next/headers";

const opts = {
  points: 11,
  duration: 24 * 60 * 60, // 24 hours
};

const rateLimiter = new RateLimiterMemory(opts);

const openai = createOpenAI({
  apiKey: process.env.AI_KEY,
});
const model = openai("gpt-4o");

// const openai = createOpenAI({
//   baseURL: "https://api.groq.com/openai/v1",
//   apiKey: process.env.AI_KEY,
// });
// const model = openai("llama3-70b-8192");

export async function generate(prompt: string) {
  "use server";
  const _headers = headers();
  const email = _headers.get("email");
  if (!email) {
    throw new Error("Email not found: Unauthorized");
  }

  try {
    const limiter = await rateLimiter.consume(email);

    if (limiter.remainingPoints <= 0) {
      return { error: "Rate limit exceeded" };
    }
  } catch (error) {
    return { error: "Rate limit exceeded" };
  }

  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = await streamText({
      model,
      prompt: prompt.slice(0, 1000),
      system: `
      write a html for the prompt using tailwindcss and plain html
  
      Important: give me only the html code inside body nothing else. Don't give any explanation just output the code.
      ----
      Important: if you need image url use this url: 'https://picsum.photos/200/300'
      eg: <img src="https://picsum.photos/200/300" />
      ----
      always add the closing tag to the html
      eg: <input type="text" />
      eg: <img src="https://picsum.photos/200/300" />
      ----
      Do not include svg icons.
      Do not add screen height as min-h-screen instead use w-full and h-full for parent container.
      Do not add href to anchor tags.
      Do not use script, style, or any other html  tags.
      `,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
