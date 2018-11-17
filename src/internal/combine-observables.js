import Observable from './observable';
import Observer from './observer';

/**
 * @param {Observable<any>[]} observables
 * @returns {Observable<any[]>}
 */
export default function CombineObservables(observables) {
  return new Observable((observer) => {
    observer.next(observables);
    observer.complete();
  }).transform(combineTransformation);
}

const Empty = Symbol('empty');

/**
 * @type {import('./types').Transformation<any[], Observable<any>[]>}
 */
function combineTransformation(externalObserver) {
  let noEmptyValues = false;

  return new Observer({
    next: subscribeToObservables,
  });

  /** @param {Observable<any>[]} observables */
  function subscribeToObservables(observables) {
    const combinedValues = initialCombinedValues(observables);

    observables
      .map((observable, index) =>
        observable.subscribe({
          next: itemUpdater(combinedValues, index),
          error: (e) => externalObserver.error(e),
          complete: () => externalObserver.complete(),
        })
      )
      .forEach((subscription) => {
        externalObserver.onClose(() => subscription.unsubscribe());
      });
  }

  /**
   * @param {Observable<any>[]} observables
   * @returns {any[]}
   */
  function initialCombinedValues(observables) {
    return observables.map(() => Empty);
  }

  /**
   * @param {any[]} array
   * @param {number} itemIndex
   */
  function itemUpdater(array, itemIndex) {
    return updateItemWith;

    /** @param {any} value  */
    function updateItemWith(value) {
      array[itemIndex] = value;
      noEmptyValues = noEmptyValues || hasNoEmptyValues(array);
      if (noEmptyValues) {
        emitCombinedValues(array);
      }
    }
  }

  /**
   * @param {any[]} combinedValues
   * @returns {combinedValues is Result}
   */
  function hasNoEmptyValues(combinedValues) {
    return combinedValues.every((v) => v !== Empty);
  }

  /**
   * @param {any[]} combinedValues
   */
  function emitCombinedValues(combinedValues) {
    const copy = combinedValues.slice();
    externalObserver.next(copy);
  }
}
