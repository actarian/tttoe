
export function className(...args: ({ [key: string]: boolean } | string)[]): string {
  return args.map(x => (
    typeof x === 'object' ?
      Object.keys(x).filter(key => x[key]).join(' ') :
      x.toString()
  )).join(' ');
}
