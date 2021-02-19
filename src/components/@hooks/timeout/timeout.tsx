
import { useEffect, useRef } from 'react';

export function useTimeout(timeout: () => void, props: any[] = [], ms:number = 500): void {
  const timeoutRef = useRef<number | null>(null);
  useEffect(() => {
    const clearRef = () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    }
    clearRef();
    timeoutRef.current = setTimeout(() => {
      timeout();
    }, ms) as any;
    return clearRef;
  }, props);
}
