import { apiFetch } from "./api";

export async function streamChatMessage(
  message: string,
  onChunk: (chunk: string) => void,
) {
  const response = await apiFetch("/Chat/send-chat", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: message,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to start chat");
  }

  if (!response.body) {
    throw new Error("Streaming response not available");
  }

  let decoder: TextDecoder;
  if (typeof TextDecoder !== "undefined") {
    decoder = new TextDecoder();
  } else {
    const { TextDecoder: PolyfillDecoder } = require("text-encoding");
    decoder = new PolyfillDecoder("utf-8");
  }

  const reader = response.body.getReader();
  let fullText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      if (chunk) {
        fullText += chunk;
        onChunk(fullText);
      }
    }
  } finally {
    reader.releaseLock();
  }

  return fullText;
}
