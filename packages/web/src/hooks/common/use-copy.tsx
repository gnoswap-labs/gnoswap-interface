import { useState } from "react";

type CopyFn = (text?: string) => void; // Return success

export function useCopy(): [boolean, CopyFn] {
  const [copied, setCopied] = useState(false);

  const copy = async (textToCopy?: string) => {
    if (!textToCopy) return;

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  };

  return [copied, copy];
}
