import Observer from './observer';
import Subscription, { onUnsubscribe } from './subscription';
import ObservableFromIterable from './observable-from-iterable';
import transformObservable from './transform-observable';
import ErrorObservable from './error-observable';
import EmptyObservable from './empty-observable';
import ObservableFromEvent from './observable-from-event';
import CombineObservables from './combine-observables';

/**
 * @template T
 * @typedef {Object} Privates
 * @prop {import("./types").SubscribeLogic<T>} subscribeLogic
 */

/** @type {WeakMap<Observable<any>, Privates<any>>} */
const privatesMap = new WeakMap();

/** @template T @returns {Privates<T>} */
function getPrivates(/** @type {Observable<T>} */ subscription) {
  const privates = privatesMap.get(subscription);
  if (!privates) {
    throw new Error('Observable - Missing privates');
  }
  return privates;
}

/**
 * @template T
 */
class Observable {
  /**
   * @param {import("./types").SubscribeLogic<T>} subscribeLogic
   */
  constructor(subscribeLogic) {
    const privates = {
      subscribeLogic,
    };

    privatesMap.set(this, privates);
  }

  /**
   * @param {import("./types").ObserverLike<T>} [observerLike]
   * @returns {Subscription}
   */
  subscribe(observerLike) {
    const { subscribeLogic } = getPrivates(this);
    const observer =
      observerLike instanceof Observer
        ? observerLike
        : new Observer(observerLike);
    let subscription = new Subscription();
    onUnsubscribe(subscription, () => observer.close());
    observer.onClose(() => subscription.unsubscribe());

    try {
      const unsubscribeLogic = subscribeLogic(observer);
      if (unsubscribeLogic) {
        onUnsubscribe(subscription, unsubscribeLogic);
      }
    } catch (e) {
      observer.error(e);
    }
    return subscription;
  }

  /**
   * @template R
   * @param {import('./types').Transformation<R, T>} transformation
   * @returns {Observable<R>}
   */
  transform(transformation) {
    return transformObservable(this, transformation);
  }
}

Observable.fromIterable = ObservableFromIterable;
Observable.fromEvent = ObservableFromEvent;
Observable.error = ErrorObservable;
Observable.empty = EmptyObservable;
Observable.combined = CombineObservables;

export default Observable;
