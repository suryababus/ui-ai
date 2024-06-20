"use client";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
type Props = {
  html: string;
};

export default function RenderComponent({ html }: Props) {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const iframeDoc = contentRef?.contentWindow?.document;
  const body = iframeDoc?.body;
  const head = iframeDoc?.head;
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iframeDoc) {
      console.log("html", html);
      const root = iframeDoc.getElementById("root");
      if (root) {
        root.innerHTML = html;
      }
    }
  }, [iframeDoc, html]);

  return (
    <ErrorBoundary errorComponent={() => <div>Error</div>}>
      <iframe className="w-full h-full" ref={setContentRef}>
        {head &&
          createPortal(
            <link
              href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
              rel="stylesheet"
            />,
            head
          )}
        {body &&
          createPortal(
            <>
              <div
                id="root"
                ref={divRef}
                className="light text-foreground w-full overflow-scroll grid place-items-center bg-muted/50 border-4 border-blue-500 rounded-lg rounded-tl-none min-h-96 h-full"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </>,
            body
          )}
      </iframe>
    </ErrorBoundary>
  );
}
