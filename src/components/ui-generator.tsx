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

const _componentString = ``;
export const Loader = () => (
  <div className="flex-1 w-full h-full bg-gray-400 animate-pulse" />
);
const RenderComponent = dynamic(() => import("./render-component"), {
  ssr: false,
  loading: Loader,
});

type LLMState = {
  prompt: string;
  output: string;
  setOutput: (output: string) => void;
  appendOutput: (output: string) => void;
  setPrompt: (prompt: string) => void;
};
const useLLMState = create<LLMState>((set) => {
  return {
    prompt: "",
    output: "",
    setPrompt: (prompt: string) => set({ prompt }),
    appendOutput: (output: string) =>
      set((state) => ({ output: state.output + output })),
    setOutput: (output: string) => set({ output }),
  };
});

export default function UIGenerator() {
  const [isPending, startTransition] = useTransition();
  // onClick={() => startTransition(() => onClick(true))}
  const {
    output: componentString,
    prompt,
    setPrompt,
    setOutput: setComponentString,
  } = useLLMState();

  const [showRateLimitModal, setShowRateLimitModal] = React.useState(false);
  // const [componentString, setComponentString] =
  //   React.useState(_componentString);
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
        finalText = finalText.replaceAll("`", "");

        if (finalText.startsWith("html")) {
          finalText = finalText.slice(5);
        }
        setComponentString(finalText ?? "");
      }
      setComponentString(finalText);

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

          {componentString !== "" ? (
            <div className="grid grid-cols-2 gap-4  w-full min-h-[60vh]">
              <div className=" flex flex-col w-full h-full ">
                <div className="flex flex-row gap-4">
                  <span className="bg-blue-500 text-white p-2">HTML</span>
                  {!loading && <ReactButton html={componentString} />}
                </div>
                <Editor
                  className={` flex-1 overflow-scroll bg-muted/50 border-4 border-blue-500 rounded-lg rounded-tl-none  min-h-96 ${
                    isPending ? "animate-pulse" : ""
                  }`}
                  defaultLanguage="javascript"
                  value={componentString}
                  onChange={(value) => {
                    if (loading) return;
                    setComponentString(value ?? "");
                  }}
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
          ) : null}
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
import { create } from "zustand";
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
      <button
        className="bg-orange-500 text-white p-2 rounded-lg"
        onClick={onClick}
      >
        Copy React
      </button>
    </span>
  );
}
