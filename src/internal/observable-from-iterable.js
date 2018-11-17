import Observable from './observable';

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @returns {Observable<T>}
 */
function ObservableFromIterable(iterable) {
  return new Observable((observer) => {
    for (let val of iterable) {
      if (observer.isClosed) {
        return;
      }
      observer.next(val);
    }
    observer.complete();
  });
}

export default ObservableFromIterable;
