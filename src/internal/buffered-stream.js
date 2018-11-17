import { Maybe } from 'utils/fp';

import Observable from './observable';
import { withoutElement } from 'utils/array';
import Observer from './observer';
import transformObservable from './transform-observable';
import startWith from './transformations/start-with';

/**
 * @template T
 * @typedef {Object} Privates
 * @prop {Observer<T>} rootObserver
 * @prop {Observable<T>} rootObservable
 * @prop {Observer<T>[]} observers
 * @prop {number} bufferSize
 * @prop {T[]} bufferedValues
 */

/** @type {WeakMap<BufferedStream<any>, Privates<any>>} */
const privatesMap = new WeakMap();

/** @template T @returns {Privates<T>} */
function getPrivates(/** @type {BufferedStream<T>} */ subscription) {
  const privates = privatesMap.get(subscription);
  if (!privates) {
    throw new Error('Stream - Missing privates');
  }
  return privates;
}

/**
 * @template T
 */
class BufferedStream {
  /**
   *
   * @param {number} [bufferSize]
   * @param {T[]} [initialValues]
   */
  constructor(bufferSize = 0, initialValues) {
    const rootObservable = RootObservable(this);
    const rootObserver = RootObserver(this);

    const bufferedValues = new Maybe(initialValues)
      .map((values) => values.slice(-bufferSize))
      .getValue([]);

    const privates = {
      rootObservable,
      rootObserver,
      observers: [],
      bufferSize,
      bufferedValues,
    };

    privatesMap.set(this, privates);
  }

  /**
   * @param {import("./types").ObserverLike<T>} [observer]
   * @returns {import("./subscription").default}
   */
  subscribe(observer) {
    const { rootObserver } = getPrivates(this);

    const subscription = this.asReadOnly().subscribe(observer);

    rootObserver.onClose(() => subscription.unsubscribe());
    return subscription;
  }

  /**
   * @param {T} v
   */
  next(v) {
    const { rootObserver } = getPrivates(this);
    rootObserver.next(v);
  }

  /**
   * @param {any} e
   */
  error(e) {
    const { rootObserver } = getPrivates(this);
    rootObserver.error(e);
  }

  complete() {
    const { rootObserver } = getPrivates(this);
    rootObserver.complete();
  }

  /**
   * @template R
   * @param {import('./types').Transformation<R, T>} transformation
   * @returns {Observable<R>}
   */
  transform(transformation) {
    return transformObservable(this.asReadOnly(), transformation);
  }

  /**
   * @returns {Observable<T>}
   */
  asReadOnly() {
    const { rootObservable, bufferedValues } = getPrivates(this);
    return rootObservable.transform(startWith(bufferedValues));
  }
}

/**
 * @template T
 * @param {BufferedStream<T>} stream
 * @returns {Observable<T>}
 */
function RootObservable(stream) {
  return new Observable(registerObserver);

  /** @param {Observer<T>} observer */
  function registerObserver(observer) {
    const privates = getPrivates(stream);
    privates.observers = [...privates.observers, observer];
    // privates.rootObserver.onClose(() => observer.close());
    return unregisterObserver;

    function unregisterObserver() {
      privates.observers = withoutElement(privates.observers, observer);
    }
  }
}

/**
 * @template T
 * @param {BufferedStream<T>} stream
 * @returns {Observer<T>}
 */
function RootObserver(stream) {
  return new Observer({
    next,
    error,
    complete,
  });

  /** @param {T} v */
  function next(v) {
    const { observers } = getPrivates(stream);
    updateBufferedValue(stream, v);
    observers.forEach((o) => {
      o.next(v);
    });
  }

  /** @param {*} e */
  function error(e) {
    const { observers } = getPrivates(stream);
    observers.forEach((o) => {
      o.error(e);
    });
  }

  function complete() {
    const { observers } = getPrivates(stream);
    observers.forEach((o) => {
      o.complete();
    });
  }
}

/**
 * @template T
 * @param {BufferedStream<T>} stream
 * @param {T} value
 */
function updateBufferedValue(stream, value) {
  const privates = getPrivates(stream);
  const newBufferedValues = [...privates.bufferedValues, value];
  if (newBufferedValues.length > privates.bufferSize) {
    newBufferedValues.shift();
  }
  privates.bufferedValues = newBufferedValues;
}

export default BufferedStream;
