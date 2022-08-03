/** @jsx h */
import { ComponentChildren, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import * as Icons from "../components/Icons.tsx";

export default function CopyArea(props: { children: ComponentChildren }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    if (props.children === undefined || props.children === null) {
      return;
    }
    try {
      await navigator.clipboard.writeText(props.children.toString());
      setCopied(true);
    } catch (error) {
      setCopied(false);
      console.error((error && error.message) || "Copy failed");
    }
  }

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div class={tw`py-2 px-4 bg(gray-100) flex group`}>
      <pre class={tw`overflow-x-auto flex-1`}>
        {props.children}
      </pre>

      <div class={tw`relative opacity-0 group-hover:opacity-100`}>
        <div
          class={tw`transition ease-in-out absolute pointer-events-none bg-gray-900 text-white absolute p-2 -top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-full box-border rounded opacity-0 ${
            copied && "opacity-100"
          }`}
        >
          Copied!
        </div>
        <button
          aria-label="Copy to Clipboard"
          disabled={!IS_BROWSER}
          class={tw`rounded p-1.5 border border-[#D2D2DC] hover:bg-gray-200 text-green-600 relative`}
          onClick={handleClick}
        >
          {copied ? <Icons.Check /> : <Icons.Copy />}
        </button>
      </div>
    </div>
  );
}
