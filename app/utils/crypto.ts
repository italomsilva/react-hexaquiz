/**
 * Utility functions for masking/unmasking answers.
 * In a real-world scenario, you shouldn't rely on frontend Base64 
 * for true security, but this prevents simple accidental inspection.
 */

export const safeEncodeBase64 = (text: string): string => {
  if (!text) return "";
  try {
    return btoa(encodeURIComponent(text));
  } catch (error) {
    return btoa(text);
  }
};

export const safeDecodeBase64 = (base64Text: string): string => {
  if (!base64Text || base64Text === "HIDDEN") return base64Text;
  try {
    return decodeURIComponent(atob(base64Text));
  } catch (error) {
    try {
      return atob(base64Text);
    } catch {
      return base64Text; // Fallback to plain text if not valid base64
    }
  }
};
