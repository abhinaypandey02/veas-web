export function renderRichText(text: string) {
  return (
    text
      // ** bold ** first (before single *), must contain a non-whitespace char
      .replace(
        /\*\*(\S(?:.*?\S)?)\*\*/g,
        '<span class="font-semibold">$1</span>',
      )
      // * bold *, must contain a non-whitespace char
      .replace(/\*(\S(?:.*?\S)?)\*/g, '<span class="font-semibold">$1</span>')
      // _ italic _, must contain a non-whitespace char
      .replace(/_(\S(?:.*?\S)?)_/g, "<em>$1</em>")
  );
}
