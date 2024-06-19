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
    try {
      setLoading(true);
      const res = await generate(prompt);

      const output = res.output;
      if (!output) {
        throw new Error(res.error);
      }

      setComponentString("");
      for await (const textPart of readStreamableValue(output)) {
        console.log(textPart);

        setComponentString((prev) => {
          let newText = prev + textPart;
          newText = newText.replaceAll("`", "");

          if (newText.startsWith("html")) {
            newText = newText.slice(5);
          }

          return newText;
        });
      }
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
            <div className="grid grid-cols-2 gap-4  w-full min-h-96">
              <div className=" flex flex-col w-full h-full ">
                <div className="">
                  <span className="bg-blue-500 text-white p-2">HTML</span>
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
                <div className="">
                  <span className="bg-blue-500 text-white p-2">UI</span>
                </div>
                <RenderComponent html={componentString} />
              </div>
            </div>
          ) : null}

          <div id="output" className="h-full w-full overflow-scroll"></div>
        </motion.div>
      </Suspense>
    </main>
  );
}
