/**
 * Utility functions for game code generation and validation
 */

/**
 * Generate a short, memorable room code (e.g., "ABCD", "X7K2")
 * Format: 4 uppercase letters and numbers (excluding easily confused chars)
 */
export function generateRoomCode(): string {
  // Use uppercase letters and numbers, excluding I, O, 1, 0 to avoid confusion
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Validate room code format
 */
export function isValidRoomCode(code: string): boolean {
  return /^[A-Z0-9]{4}$/.test(code.toUpperCase());
}

/**
 * Normalize room code (uppercase, trim)
 */
export function normalizeRoomCode(code: string): string {
  return code.toUpperCase().trim();
}

/**
 * Get current timestamp in milliseconds
 */
export function getCurrentTimestamp(): number {
  return Date.now();
}

/**
 * Format timestamp to readable date string
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString();
}

/**
 * Generate short ID (for event IDs, prediction IDs, etc.)
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
