import { useCallback } from "react";
import { useToken } from "naystack/auth/email/client";
import { ERROR_MESSAGES,ChatStreamRole } from "@veas/constants";

export function useStreaming(url: string) {
  const token = useToken();
  return useCallback(
    (
      body: string,
      {
        onError,
        onTool,
        onResponse,
        onComplete,
      }: {
        onTool: (message: string) => void;
        onResponse: (message: string) => void;
        onError: (message: string) => void;
        onComplete: () => void;
      },
    ) => {
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      })
        .then(async (res) => {
          if (!res.body) {
            return onError("No response body");
          }

          if (!res.ok) {
            return onError?.(await res.text());
          }

          const reader = res.body.getReader();
          const decoder = new TextDecoder();

          try {
            while (true) {
              const { done, value } = await reader.read();

              if (done) {
                break;
              }

              // Decode the chunk and accumulate
              const chunk = decoder.decode(value, { stream: true });
              chunk.split("\n").forEach((line) => {
                if (line.trim()) {
                  const json = JSON.parse(line);
                  if (json.type === ChatStreamRole.Tool) {
                    onTool(json.message);
                  } else if (json.type === ChatStreamRole.Response) {
                    onResponse(json.message);
                  } else if (json.type === ChatStreamRole.Error) {
                    onError(json.message);
                  }
                }
              });
            }
          } catch (error) {
            console.error("Stream error:", error);
            // Update the message with error state if needed
            return onError(
              "Sorry, something went wrong while generating a response. Please try again.",
            );
          } finally {
            reader.releaseLock();
          }
        })
        .catch((error) => {
          if (
            error.message === ERROR_MESSAGES.FREE_LIMIT_REACHED ||
            error.message === ERROR_MESSAGES.PRO_LIMIT_REACHED
          ) {
            return onError(error.message);
          }
          return onError(
            "Sorry, something went wrong while generating a response. Please try again.",
          );
        })
        .finally(() => {
          onComplete?.();
        });
    },
    [token, url],
  );
}
