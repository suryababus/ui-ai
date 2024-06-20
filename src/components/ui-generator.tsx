"use client";

import { generate } from "@/action";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import React, { Suspense, useEffect, useTransition } from "react";
import ReactDOM from "react-dom";
import { LoaderCircle } from "lucide-react";

import Editor from "@monaco-editor/react";
import { readStreamableValue } from "ai/rsc";
import dynamic from "next/dynamic";
import { emitEvent } from "@/lib/firebase";
import { motion } from "framer-motion";
import { RateLimitedModal } from "./ui/rate-limited-modal";

const _componentString = `
<div class="w-full h-full bg-gray-900 text-white">
  <header class="flex justify-between items-center p-6">
    <h1 class="text-3xl font-bold">StreamFlix</h1>
    <nav>
      <ul class="flex space-x-6">
        <li><a class="hover:text-gray-400">Home</a></li>
        <li><a class="hover:text-gray-400">Movies</a></li>
        <li><a class="hover:text-gray-400">TV Shows</a></li>
        <li><a class="hover:text-gray-400">My List</a></li>
      </ul>
    </nav>
  </header>
  
  <main class="flex flex-col items-center p-6">
    <section class="text-center mb-12">
      <h2 class="text-4xl font-bold mb-4">Unlimited movies, TV shows, and more.</h2>
      <p class="text-lg mb-6">Watch anywhere. Cancel anytime.</p>
      <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Get Started</button>
    </section>
    
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-gray-800 p-4 rounded">
        <img src="https://picsum.photos/200/300" alt="Movie 1" class="w-full h-48 object-cover rounded mb-4" />
        <h3 class="text-xl font-bold mb-2">Movie Title 1</h3>
        <p class="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      <div class="bg-gray-800 p-4 rounded">
        <img src="https://picsum.photos/200/300" alt="Movie 2" class="w-full h-48 object-cover rounded mb-4" />
        <h3 class="text-xl font-bold mb-2">Movie Title 2</h3>
        <p class="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      <div class="bg-gray-800 p-4 rounded">
        <img src="https://picsum.photos/200/300" alt="Movie 3" class="w-full h-48 object-cover rounded mb-4" />
        <h3 class="text-xl font-bold mb-2">Movie Title 3</h3>
        <p class="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    </section>
  </main>
  
  <footer class="text-center p-6 mt-12">
    <p class="text-gray-500">&copy; 2023 StreamFlix. All rights reserved.</p>
  </footer>
</div>

`;
export const Loader = () => (
  <div className="flex-1 w-full h-full bg-gray-400 animate-pulse" />
);
const RenderComponent = dynamic(() => import("./render-component"), {
  ssr: false,
  loading: Loader,
});

export default function UIGenerator() {
  const [isPending, startTransition] = useTransition();
  // onClick={() => startTransition(() => onClick(true))}

  const [prompt, setPrompt] = React.useState("");
  const [showRateLimitModal, setShowRateLimitModal] = React.useState(false);
  const [componentString, setComponentString] =
    React.useState(_componentString);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    emitEvent({
      event: "page_view",
      data: {
        path: window.location.pathname,
      },
    });
  }, []);

  async function onClick() {
    emitEvent({
      event: "click on generate",
      data: {
        prompt,
      },
    });
    try {
      setLoading(true);
      const res = await generate(prompt);

      const output = res.output;
      if (!output) {
        throw new Error(res.error);
      }

      const textStream = readStreamableValue(output);
      let finalText = "";
      setComponentString("");
      for await (const textPart of textStream) {
        console.log(textPart);
        finalText += textPart;
        setComponentString((prev) => {
          let newText = prev + textPart;
          newText = newText.replaceAll("`", "");

          if (newText.startsWith("html")) {
            newText = newText.slice(5);
          }

          return newText;
        });
      }

      emitEvent({
        event: "component generated",
        data: {
          prompt,
          promptLength: prompt.length,
          component: finalText,
          componentLength: finalText.length,
        },
      });
    } catch (error) {
      setShowRateLimitModal(true);
    }
    setLoading(false);
  }
  return (
    <main className="flex flex-1 min-w-screen text-foreground flex-col items-center  p-10">
      <Suspense fallback={<Loader />}>
        {showRateLimitModal && (
          <RateLimitedModal onCloseClick={() => setShowRateLimitModal(false)} />
        )}
        <motion.div className="flex flex-col gap-4 w-full justify-center items-center min-h-96">
          <h1 className="text-4xl">Which UI component are you thinking of?</h1>
          <Textarea
            className="w-1/2 border-[1px] border-blue-500"
            placeholder="Enter your component description"
            onChange={(event) => setPrompt(event.target.value)}
            value={prompt}
            disabled={loading}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={onClick}
            disabled={loading}
          >
            {loading ? <LoaderCircle className="animate-spin" /> : "Generate"}
          </button>
          {/* <ComponentRenderer componentString={componentString} /> */}

          <div className="grid grid-cols-2 gap-4  w-full min-h-[60vh]">
            <div className=" flex flex-col w-full h-full ">
              <div className="flex flex-row gap-4">
                <span className="bg-blue-500 text-white p-2">HTML</span>
                <ReactButton html={componentString} />
              </div>
              <Editor
                className={` flex-1 overflow-scroll bg-muted/50 border-4 border-blue-500  min-h-96 ${
                  isPending ? "animate-pulse" : ""
                }`}
                defaultLanguage="javascript"
                value={componentString}
                onChange={(value) => setComponentString(value ?? "")}
                theme=""
                loading={<Loader />}
                options={{
                  minimap: { enabled: false },
                }}
              ></Editor>
            </div>
            <div className=" flex flex-col w-full h-full ">
              <div className="flex flex-row justify-between">
                <span className="bg-blue-500 text-white p-2">UI</span>
              </div>
              <RenderComponent html={componentString} />
            </div>
          </div>
        </motion.div>
      </Suspense>
    </main>
  );
}

type Props = {
  html: string;
};

import * as prettier from "https://unpkg.com/prettier@3.3.2/standalone.mjs";
import babel from "https://unpkg.com/prettier@3.3.2/plugins/babel.mjs";
import estree from "https://unpkg.com/prettier@3.3.2/plugins/estree.mjs";
import { useToast } from "./ui/useToast";
// import typescript from "https://unpkg.com/prettier@3.3.2/plugins/typescript.mjs";

function ReactButton({ html }: Props) {
  const reactFormatedHtml = html.replace(/class=/g, "className=");
  const { showMessage } = useToast();

  // add import to html
  const reactFormatedHtmlWithImport = `
  import React from 'react';
  export const Component = () => {
    return (${reactFormatedHtml})
  }
  `;

  const onClick = async () => {
    const formatted = await prettier.format(reactFormatedHtmlWithImport, {
      parser: "babel",
      plugins: [estree, babel],
    });
    console.log(formatted);
    showMessage("Copied to clipboard");
    navigator.clipboard.writeText(formatted);
  };

  return (
    <span className="m-1">
      <span className="bg-blue-500 text-white p-2 rounded-lg" onClick={onClick}>
        Copy React
      </span>
    </span>
  );
}
