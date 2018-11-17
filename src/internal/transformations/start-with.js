import Observer from '../observer';

/**
 * @template T
 * @param {Iterable<T>} initialValues
 */
export default function startWith(initialValues) {
  return startWithTransformation;

  /**
   * @type {import('../types').Transformation<T, T>}
   */
  function startWithTransformation(externalObserver) {
    for (let v of initialValues) {
      if (externalObserver.isClosed) {
        break;
      }
      externalObserver.next(v);
    }
    return new Observer({
      next: (v) => externalObserver.next(v),
      error: (e) => externalObserver.error(e),
      complete: () => externalObserver.complete(),
    });
  }
}
