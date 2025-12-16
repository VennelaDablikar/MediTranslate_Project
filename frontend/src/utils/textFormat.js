export const cleanText = (text) => {
  return text
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z0-9-.\n ]/g, "")
    .trim();
};

export const capitalizeWords = (text) => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};
