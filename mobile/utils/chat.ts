import React from "react";
import { Text } from "react-native";

/**
 * Parses rich text with *bold* and _italic_ markers into an array of
 * React Native Text elements.
 */
export function parseRichText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match **bold**, *bold*, or _italic_
  const regex = /(\*\*\S(?:.*?\S)?\*\*|\*\S(?:.*?\S)?\*|_\S(?:.*?\S)?_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add plain text before this match
    if (match.index > lastIndex) {
      const plain = text.substring(lastIndex, match.index).replace(/[*_]/g, "");
      if (plain) {
        parts.push(plain);
      }
    }

    const matched = match[0];
    if (matched.startsWith("**")) {
      // **bold**
      const inner = matched.slice(2, -2);
      parts.push(
        React.createElement(
          Text,
          { key: `b-${key++}`, style: { fontWeight: "600" } },
          inner
        )
      );
    } else if (matched.startsWith("*")) {
      // *bold*
      const inner = matched.slice(1, -1);
      parts.push(
        React.createElement(
          Text,
          { key: `b-${key++}`, style: { fontWeight: "600" } },
          inner
        )
      );
    } else if (matched.startsWith("_")) {
      // _italic_
      const inner = matched.slice(1, -1);
      parts.push(
        React.createElement(
          Text,
          { key: `i-${key++}`, style: { fontStyle: "italic" } },
          inner
        )
      );
    }

    lastIndex = match.index + matched.length;
  }

  // Add remaining plain text
  if (lastIndex < text.length) {
    const plain = text.substring(lastIndex).replace(/[*_]/g, "");
    if (plain) {
      parts.push(plain);
    }
  }

  return parts;
}
