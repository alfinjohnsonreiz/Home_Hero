export function toTitleCase(str:string) {
  if (!str) return "";
  
  const splitCamelCase = (word:any) =>
    word.replace(/([a-z])([A-Z])/g, "$1 $2");

  return str
    .split(" ")
    .map((word) => {
      const splitWords = splitCamelCase(word).split(" ");
      return splitWords
        .map((w:any) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    })
    .join(" ");
}
