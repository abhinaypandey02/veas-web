import { format, whatsappRules } from "@flasd/whatsapp-formatting";

export function renderRichText(text: string) {
  return format(text.replace(/\*\s+\*/g, "- *"), [
    {
      wildcard: "*",
      openTag: '<span class="font-semibold">',
      closeTag: "</span>",
    },
    ...whatsappRules,
    {
      wildcard: "**",
      openTag: '<span class="font-semibold">',
      closeTag: "</span>",
    },
  ]);
}
