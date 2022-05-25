// taken from Group Array of JavaScript Objects by Key or Property Value
// https://gist.github.com/JamieMason/0566f8412af9fe6a1d470aa1e089a752?permalink_comment_id=3671217#gistcomment-3671217
export function groupBy<T extends Record<string, any>, K extends keyof T>(
  array: T[],
  key: K | { (obj: T): string },
): Record<string, T[]> {
  const keyFn = key instanceof Function ? key : (obj: T) => obj[key];
  return array.reduce((objectsByKeyValue, obj) => {
    const value = keyFn(obj);
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {} as Record<string, T[]>);
}
