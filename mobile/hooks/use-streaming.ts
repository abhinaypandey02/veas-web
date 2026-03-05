import { useCallback } from "react";
import { useToken } from "naystack/auth/email/client";
import { ChatStreamRole, ERROR_MESSAGES } from "@/constants/chat";

const API_BASE_URL = process.env.EXPO_PUBLIC_GRAPHQL_BASE_URL || "";

export function useStreaming(path: string) {
  const token = useToken();
  const url = `${API_BASE_URL}${path}`;

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
      }
    ) => {
      const xhr = new XMLHttpRequest();
      let lastIndex = 0;

      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.setRequestHeader("Content-Type", "text/plain");

      xhr.onprogress = () => {
        const newData = xhr.responseText.substring(lastIndex);
        lastIndex = xhr.responseText.length;

        newData.split("\n").forEach((line) => {
          if (line.trim()) {
            try {
              const json = JSON.parse(line);
              if (json.type === ChatStreamRole.Tool) {
                onTool(json.message);
              } else if (json.type === ChatStreamRole.Response) {
                onResponse(json.message);
              } else if (json.type === ChatStreamRole.Error) {
                onError(json.message);
              }
            } catch {
              // Skip malformed JSON lines
            }
          }
        });
      };

      xhr.onload = () => {
        // Process any remaining data
        const newData = xhr.responseText.substring(lastIndex);
        newData.split("\n").forEach((line) => {
          if (line.trim()) {
            try {
              const json = JSON.parse(line);
              if (json.type === ChatStreamRole.Tool) {
                onTool(json.message);
              } else if (json.type === ChatStreamRole.Response) {
                onResponse(json.message);
              } else if (json.type === ChatStreamRole.Error) {
                onError(json.message);
              }
            } catch {
              // Skip malformed JSON lines
            }
          }
        });
        onComplete();
      };

      xhr.onerror = () => {
        onError(
          "Sorry, something went wrong while generating a response. Please try again."
        );
        onComplete();
      };

      xhr.send(body);
    },
    [token, url]
  );
}
