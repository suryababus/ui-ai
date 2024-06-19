"use server";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, streamText } from "ai";
import { StreamingTextResponse } from "ai";
import { createStreamableValue } from "ai/rsc";

const openai = createOpenAI({
  apiKey: process.env.AI_KEY,
});
const model = openai("gpt-4o");

// const openai = createOpenAI({
//   baseURL: "https://api.groq.com/openai/v1",
//   apiKey: process.env.AI_KEY,
// });
// const model = openai("llama3-70b-8192");

export async function llmCall(prompt: string) {
  const response = await streamText({
    model,
    prompt,
    system: `
    write a html for the prompt using tailwindcss and plain html

    Important: give me only the html code inside body nothing else. Don't give any explanation just output the code.

    

    `,
  });
  return response;
}

export async function generate(prompt: string) {
  "use server";

  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = await streamText({
      model,
      prompt,
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
      `,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}

let i = 0;

export async function increment() {
  i = i + 1;

  return new Promise((resolve) => setTimeout(resolve, 5000));
}
