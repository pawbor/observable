import Observer from '../observer';

/**
 * @template T
 * @param {import('utils/fp/types').Predicate<T>} [predicate]
 */
export default function first(predicate = () => true) {
  return filterTransformation;

  /**
   * @type {import('../types').Transformation<T, T>}
   */
  function filterTransformation(externalObserver) {
    return new Observer({
      next: passFirstMatchingAndComplete,
      error: (e) => externalObserver.error(e),
      complete: () => externalObserver.complete(),
    });

    /**
     * @param {T} value
     */
    function passFirstMatchingAndComplete(value) {
      const shouldPass = predicate(value);
      if (shouldPass) {
        externalObserver.next(value);
        externalObserver.complete();
      }
    }
  }
}
