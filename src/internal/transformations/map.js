import Observer from '../observer';

/**
 * @template T, R
 * @param {import('utils/fp/types').Mapping<T, R>} mapping
 */
export default function map(mapping) {
  return mapTransformation;

  /**
   * @type {import('../types').Transformation<R, T>}
   */
  function mapTransformation(externalObserver) {
    return new Observer({
      next: mapValue,
      error: (e) => externalObserver.error(e),
      complete: () => externalObserver.complete(),
    });

    /**
     * @param {T} value
     */
    function mapValue(value) {
      const transformedValue = mapping(value);
      externalObserver.next(transformedValue);
    }
  }
}
