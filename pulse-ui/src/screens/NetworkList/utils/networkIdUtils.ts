/**
 * Utility functions for encoding/decoding network API IDs
 * ID format: base64(method|url) - URL-safe encoding
 */

/**
 * Encodes method and url into a URL-safe ID
 * @param method - HTTP method (GET, POST, etc.)
 * @param url - API endpoint URL
 * @returns Encoded ID string
 */
export function encodeNetworkId(method: string, url: string): string {
  const idData = `${method}|${url}`;
  return btoa(encodeURIComponent(idData))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Decodes an ID back to method and url
 * @param id - Encoded ID string
 * @returns Object with method and url, or null if decoding fails
 */
export function decodeNetworkId(
  id: string,
): { method: string; url: string } | null {
  try {
    // Reverse the URL-safe base64 encoding
    const base64 = id.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = decodeURIComponent(atob(base64));
    const [method, ...urlParts] = decoded.split("|");
    const url = urlParts.join("|"); // In case URL contains |
    return { method, url };
  } catch (error) {
    console.error("Failed to decode network ID:", error);
    return null;
  }
}
