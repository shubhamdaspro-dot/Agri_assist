'use client';

import { useState, useEffect } from 'react';

/**
 * A hook to determine if the component is running on the client.
 * This is useful for avoiding hydration mismatches when dealing with
 * browser-specific APIs or data (e.g., localStorage, window, etc.).
 *
 * @returns {boolean} `true` if the component is mounted on the client, `false` otherwise.
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
