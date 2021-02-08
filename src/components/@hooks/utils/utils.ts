
export function deepCopy(source: any[] | { [key: string]: any } | number | string | boolean | null | undefined): (any[] | { [key: string]: any } | number | string | boolean | null | undefined) {
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
