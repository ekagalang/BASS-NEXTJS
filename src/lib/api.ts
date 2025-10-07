/**
 * Get the base API URL for server-side requests
 * This handles dynamic port allocation in development
 */
export function getBaseUrl(): string {
  // Check if we're on the server
  if (typeof window === 'undefined') {
    // Server-side: try multiple common ports in development
    const devPorts = ['3000', '3001', '3002', '3003'];
    const port = process.env.PORT || devPorts[0];
    return `http://localhost:${port}`;
  }

  // Client-side: use current origin
  return window.location.origin;
}

export function getApiUrl(): string {
  return `${getBaseUrl()}/api`;
}
