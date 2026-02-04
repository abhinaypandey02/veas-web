import { apiFetch } from "./api";

export async function streamChatMessage(
  message: string,
  onChunk: (chunk: string) => void,
) {
  const streamId = Math.random().toString(36).substring(7);
  console.log(`\n[CHAT ${streamId}] 💬 Starting chat stream`);
  console.log(`[CHAT ${streamId}] 📨 Message: "${message}"`);
  
  const startTime = Date.now();
  const response = await apiFetch("/Chat/send-chat", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: message,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`[CHAT ${streamId}] ❌ Error response: ${response.status}`);
    console.error(`[CHAT ${streamId}] 📄 Response body: ${text}`);
    throw new Error(text || "Failed to start chat");
  }

  console.log(`[CHAT ${streamId}] 🌊 Stream started, reading response...`);
  
  // React Native's fetch doesn't expose response.body as ReadableStream
  // So we use response.text() instead and simulate streaming by sending chunks
  try {
    console.log(`[CHAT ${streamId}] 📖 Reading entire response as text...`);
    const fullText = await response.text();
    const totalDuration = Date.now() - startTime;
    
    console.log(`[CHAT ${streamId}] ✅ Response received (${totalDuration}ms)`);
    console.log(`[CHAT ${streamId}] 📊 Total message length: ${fullText.length} chars`);
    
    // Simulate streaming by sending the complete text
    // This mimics the behavior of chunked streaming
    onChunk(fullText);
    
    console.log(`[CHAT ${streamId}] ✅ Stream complete`);
    console.log(`[CHAT ${streamId}] 📊 Total duration: ${totalDuration}ms`);
    
    return fullText;
  } catch (error) {
    console.error(`[CHAT ${streamId}] ❌ Stream error:`, error);
    throw error;
  }
}

