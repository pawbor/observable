/**
 * @typedef {Object} Privates
 * @prop {boolean} isClosed
 * @prop {Function[]} unsubscribeListeners
 */

/** @type {WeakMap<Subscription, Privates>} */
const privatesMap = new WeakMap();

/** @template T @returns {Privates} */
function getPrivates(/** @type {Subscription} */ subscription) {
  const privates = privatesMap.get(subscription);
  if (!privates) {
    throw new Error('Subscription - Missing privates');
  }
  return privates;
}

class Subscription {
  constructor() {
    const privates = {
      isClosed: false,
      unsubscribeListeners: [],
    };

    privatesMap.set(this, privates);
  }

  unsubscribe() {
    const privates = getPrivates(this);

    if (privates.isClosed) {
      return;
    }

    privates.isClosed = true;
    privates.unsubscribeListeners.forEach((listener) => {
      listener();
    });
  }

  get isClosed() {
    const privates = getPrivates(this);
    return privates.isClosed;
  }
}

/**
 *
 * @param {Subscription} subscription
 * @param {Function} listener
 */
export function onUnsubscribe(subscription, listener) {
  if (subscription.isClosed) {
    listener();
  } else {
    const privates = getPrivates(subscription);
    privates.unsubscribeListeners.push(listener);
  }
}

export default Subscription;
