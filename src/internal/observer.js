import { noop, Maybe } from 'utils/fp';

/**
 * @template T
 * @typedef {Object} Privates
 * @prop {boolean} isClosed
 * @prop {import("./types").Next<T>} destinationNext
 * @prop {import("./types").Next<any>} destinationError
 * @prop {Function} destinationComplete
 * @prop {Function[]} closeListeners
 */

/** @type {WeakMap<Observer<any>, Privates<any>>} */
const privatesMap = new WeakMap();

/** @template T @returns {Privates<T>} */
function getPrivates(/** @type {Observer<T>} */ subscription) {
  const privates = privatesMap.get(subscription);
  if (!privates) {
    throw new Error('Observer - Missing privates');
  }
  return privates;
}

/**
 * @template T
 */
class Observer {
  /**
   * @param {import("./types").ObserverLike<T>} [observerLike]
   */
  constructor(observerLike) {
    /** @type {import("./types").Next<T>} */
    let destinationNext = noop;
    /** @type {import("./types").Next<any>} */
    let destinationError = noop;
    /** @type {Function} */
    let destinationComplete = noop;

    if (typeof observerLike === 'function') {
      destinationNext = observerLike;
    } else if (observerLike) {
      new Maybe(observerLike.next).do((next) => {
        destinationNext = next;
      });
      new Maybe(observerLike.error).do((error) => {
        destinationError = error;
      });
      new Maybe(observerLike.complete).do((complete) => {
        destinationComplete = complete;
      });
    }

    const privates = {
      isClosed: false,
      destinationNext,
      destinationError,
      destinationComplete,
      closeListeners: [],
    };

    privatesMap.set(this, privates);
  }

  /** @param {T} v */
  next(v) {
    const { isClosed, destinationNext } = getPrivates(this);
    if (!isClosed) {
      destinationNext(v);
    }
  }

  /** @param {any} e */
  error(e) {
    const { isClosed, destinationError } = getPrivates(this);
    if (!isClosed) {
      destinationError(e);
      this.close();
    }
  }

  complete() {
    const { isClosed, destinationComplete } = getPrivates(this);
    if (!isClosed) {
      destinationComplete();
      this.close();
    }
  }

  /** @returns {boolean} */
  get isClosed() {
    const { isClosed } = getPrivates(this);
    return isClosed;
  }

  /** @param {Function} listener */
  onClose(listener) {
    const privates = getPrivates(this);
    if (privates.isClosed) {
      listener();
    } else {
      privates.closeListeners.push(listener);
    }
  }

  close() {
    const privates = getPrivates(this);

    if (privates.isClosed) {
      return;
    }

    privates.isClosed = true;
    privates.closeListeners.forEach((listener) => {
      listener();
    });
  }
}


export default Observer;
