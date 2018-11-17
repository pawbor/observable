import Observable from './observable';

/**
 * @template InternalT, ExternalT
 * @param {Observable<InternalT>} internalObservable
 * @param {import('./types').Transformation<ExternalT, InternalT>} transformation
 * @returns {Observable<ExternalT>}
 */
function transformObservable(internalObservable, transformation) {
  return new Observable((externalObserver) => {
    const internalObserver = transformation(externalObserver);
    externalObserver.onClose(() => {
      internalObserver.close();
    });
    internalObservable.subscribe(internalObserver);
  });
}

export default transformObservable;
