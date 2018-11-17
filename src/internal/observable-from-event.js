import Observable from './observable';
import Observer from './observer';

/**
 * @typedef {Object} EventDefinition
 * @prop {EventTarget} target
 * @prop {string} type
 * @prop {AddEventListenerOptions | boolean | undefined} [options]
 */

/**
 * @param {EventDefinition} definition
 * @returns {Observable<Event>}
 */
function ObservableFromEvent(definition) {
  return new Observable((observer) => {
    observer.next(definition);
    observer.complete();
  }).transform(eventTargetTransformation);
}

export default ObservableFromEvent;

/**
 * @type {import('./types').Transformation<Event, EventDefinition>}
 */
function eventTargetTransformation(externalObservable) {
  return new Observer({
    next: attachListener,
  });

  /**
   * @param {EventDefinition} param0
   */
  function attachListener({ target, type, options }) {
    target.addEventListener(type, listener, options);
    externalObservable.onClose(() =>
      target.removeEventListener(type, listener, options)
    );
  }

  /** @param {Event} event */
  function listener(event) {
    externalObservable.next(event);
  }
}
