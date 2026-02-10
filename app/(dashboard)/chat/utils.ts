import { format, whatsappRules } from "@flasd/whatsapp-formatting";
export function renderRichText(text: string) {
  return format(text, [
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
