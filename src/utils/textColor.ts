/**
 * Determines whether black or white text has better contrast with the given background color
 * @param backgroundColor - The background color in hex format (e.g., "#FF0000")
 * @returns "black" or "white" depending on which provides better contrast
 */
export function getTextColorForBackground(backgroundColor: string): string {
  // Convert hex color to RGB values
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate the relative luminance
  // Formula: 0.299 * R + 0.587 * G + 0.114 * B
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? "black" : "white";
}
