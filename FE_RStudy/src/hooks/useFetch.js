import { useCallback, useEffect, useState } from 'react';

export function useFetch(request) {
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState({ request: null, reloadCount: 0, data: null, error: '' });

  useEffect(() => {
    let active = true;
    request()
      .then((res) => {
        if (active) setResult({ request, reloadCount, data: res.data, error: '' });
      })
      .catch((err) => {
        if (active) setResult({ request, reloadCount, data: null, error: err.message });
      });
    return () => {
      active = false;
    };
  }, [request, reloadCount]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);
  const loading = result.request !== request || result.reloadCount !== reloadCount;

  return { data: result.data, error: loading ? '' : result.error, loading, reload };
}