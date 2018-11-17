/**
 * @template T
 * @param {(any)[]} array
 * @param {number} limit
 * @returns {T[]}
 */
export default function flatten(array, limit = Number.POSITIVE_INFINITY) {
  if (limit > 0) {
    return array.reduce(flattener, []);
  } else {
    return array;
  }

  /**
   * @param {T[]} partial
   * @param {T | any[]} el
   * @returns {T[]}
   */
  function flattener(partial, el) {
    if (Array.isArray(el)) {
      const flattened = flatten(el, limit - 1);
      return partial.concat(flattened);
    } else {
      return [...partial, el];
    }
  }
}
