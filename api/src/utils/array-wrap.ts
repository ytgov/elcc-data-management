type AsArray<T> = T extends [] ? T : T[]

/**
 * Wraps its argument in an array unless it is already an array (or array-like).
 * See https://api.rubyonrails.org/classes/Array.html#method-c-wrap
 */
export function arrayWrap<T>(value: T | T[]): AsArray<T> {
  return Array.isArray(value) ? (value as AsArray<T>) : ([value] as AsArray<T>)
}

export default arrayWrap
