import { useCallback, useEffect, useState } from "react";
import { isCancel, toError } from "../api/client";

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  reload: () => void;
}

/**
 * Runs an async fetch that receives an AbortSignal, re-running when `deps`
 * change or `reload()` is called. Cancels in-flight requests on unmount/change.
 */
export function useFetch<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = []
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const d = await fn(controller.signal);
        if (active) setData(d);
      } catch (e) {
        if (active && !isCancel(e)) setError(toError(e));
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { data, loading, error, reload };
}
