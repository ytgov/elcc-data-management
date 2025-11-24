export function presence<T>(value: T | undefined, defaultValue: T): T {
  return value === undefined ? defaultValue : value
}

export default presence
