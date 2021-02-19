

import { useCallback, useEffect, useRef } from 'react';
// import WorkerConstructor from 'worker-loader!*';

export function useWorker(getWorker: () => Promise<Worker>, callback: (result: any) => void, props: any[] = []): any {

  const workerRef = useRef<Worker | null>(null);
  useEffect(() => {
    const onMessage = (result: any) => {
      // console.log('useWorker.onMessage', result);
      callback(result);
    };
    if (!workerRef.current) {
      getWorker().then(worker => {
        workerRef.current = worker;
        workerRef.current.addEventListener('message', onMessage);
        // console.log(workerRef.current);
      });
    }
    return () => {
      if (workerRef.current) {
        workerRef.current.removeEventListener('message', onMessage);
        workerRef.current = null;
      }
    };
  }, props);
  const postMessage = useCallback((payload: any) => {
    if (workerRef.current) {
      // console.log('useWorker.postMessage', workerRef.current, payload);
      workerRef.current.postMessage(payload);
    }
  }, []);
  return [postMessage];
}
