import Observer from '../observer';

/**
 * @template T
 * @param {import('utils/fp/types').Predicate<T>} predicate
 */
export default function filter(predicate) {
  return filterTransformation;

  /**
   * @type {import('../types').Transformation<T, T>}
   */
  function filterTransformation(externalObserver) {
    return new Observer({
      next: filterValue,
      error: (e) => externalObserver.error(e),
      complete: () => externalObserver.complete(),
    });

    /**
     * @param {T} value
     */
    function filterValue(value) {
      const pass = predicate(value);
      if (pass) {
        externalObserver.next(value);
      }
    }
  }
}
