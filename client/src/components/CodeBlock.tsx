"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
interface Props {
  language: string;
  value: string;
}

export default function CodeBlock({ language, value }: Props) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="relative my-4">
      <button
        onClick={copyCode}
        className="absolute top-2 right-2 bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded text-sm"
      >
        {copied ? "Copied ✅" : "Copy"}
      </button>

      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          borderRadius: "10px",
          paddingTop: "40px",
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}