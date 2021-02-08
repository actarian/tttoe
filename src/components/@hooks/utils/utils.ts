
export type StateValue = StateValue[] | { [key: string]: StateValue } | number | string | boolean | null | undefined;

export function deepCopy<T>(source: T): T;
// export function deepCopy(source: any): any {
export function deepCopy(source: StateValue): StateValue {
  if (Array.isArray(source)) {
    return source.map(x => deepCopy(x));
  } else if (source && typeof source === 'object') {
    const copy: { [key: string]: any } = {};
    Object.keys(source).forEach(key => {
      copy[key] = deepCopy(source[key]);
    });
    return copy;
  } else {
    return source;
  }
}
