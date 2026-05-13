/**
 * Normalizes text by removing accents, diacritics and converting to uppercase.
 * Example: "Coração" -> "CORACAO"
 * 
 * @param text The text to normalize
 * @returns The normalized text
 */
export const normalizeText = (text: string): string => {
  if (!text) return "";
  
  return text
    .normalize("NFD") // Decomposes accented characters
    .replace(/[\u0300-\u036f]/g, "") // Removes the accent characters
    .replace(/ç/gi, "c") // Specific check for ç just in case
    .toUpperCase()
    .trim();
};
