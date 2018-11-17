import { noop } from 'utils/fp';

import Observable from './observable';
import Observer from './observer';
import Subscription from './subscription';

describe('Observable', () => {
  test('has subscribe method', () => {
    const observable = new Observable(noop);
    expect(observable).toHaveProperty('subscribe', expect.any(Function));
  });

  test('invokes subscribe logic when subscribed', () => {
    const subscribeLogic = jest.fn();
    const observable = new Observable(subscribeLogic);
    observable.subscribe();
    observable.subscribe();
    expect(subscribeLogic).toHaveBeenCalledTimes(2);
  });

  test('has transform method', () => {
    const observable = new Observable(noop);
    expect(observable).toHaveProperty('transform', expect.any(Function));
  });
});

test('observer is passed to subscribe logic', () => {
  let observer;
  const observable = new Observable((o) => {
    observer = o;
  });
  observable.subscribe();
  expect(observer).toEqual(expect.any(Observer));
});

test('subscribe returns subscription', () => {
  const observable = new Observable(noop);
  const subscription = observable.subscribe();
  expect(subscription).toEqual(expect.any(Subscription));
});

test('invokes unsubscribe logic when unsubscribed', () => {
  const unsubscribeLogic = jest.fn();
  const observable = new Observable(() => unsubscribeLogic);
  observable.subscribe().unsubscribe();
  observable.subscribe().unsubscribe();
  observable.subscribe();
  expect(unsubscribeLogic).toHaveBeenCalledTimes(2);
});

test('subscribed observers will receive sequences of data', () => {
  const dataSequence = [3, 7, 12];
  const observable = new Observable((o) => {
    dataSequence.forEach((v) => {
      o.next(v);
    });
  });

  const observer = jest.fn();
  observable.subscribe(observer);
  expect(observer).toHaveBeenCalledTimes(dataSequence.length);
  dataSequence.forEach((v, index) => {
    expect(observer).toHaveBeenNthCalledWith(index + 1, v);
  });
});

test('subscribed observers will receive thrown error', () => {
  const error = new Error();
  const observable = new Observable(() => {
    throw error;
  });

  const observer = { error: jest.fn() };
  observable.subscribe(observer);
  expect(observer.error).toHaveBeenCalledTimes(1);
  expect(observer.error).toHaveBeenCalledWith(error);
});

test('subscribed observers will receive passed error', () => {
  const error = new Error();
  const observable = new Observable((o) => {
    o.error(error);
  });

  const observer = { error: jest.fn() };
  observable.subscribe(observer);
  expect(observer.error).toHaveBeenCalledTimes(1);
  expect(observer.error).toHaveBeenCalledWith(error);
});

test('subscribed observers will receive complete signal', () => {
  const observable = new Observable((o) => {
    o.complete();
  });

  const observer = { complete: jest.fn() };
  observable.subscribe(observer);
  expect(observer.complete).toHaveBeenCalledTimes(1);
});

test('subscription is closed after unsubscribe', () => {
  const observable = new Observable(noop);
  const subscription = observable.subscribe();
  subscription.unsubscribe();
  expect(subscription.isClosed).toBe(true);
});

test('subscription is closed after error', () => {
  const observable = new Observable((o) => {
    o.error('1');
  });

  const subscription = observable.subscribe();
  expect(subscription.isClosed).toBe(true);
});

test('nothing is passed after subscription is closed', () => {
  const observer = {
    next: jest.fn(),
    error: jest.fn(),
    complete: jest.fn(),
  };

  const nextBefore = 5;
  const nextAfter = 10;
  const errorAfter = new Error('after');

  const observable = new Observable((o) => {
    o.next(nextBefore);
    o.complete();
    o.next(nextAfter);
    o.error(errorAfter);
    o.complete();
  });

  observable.subscribe(observer).unsubscribe();

  expect(observer.next).toHaveBeenCalledTimes(1);
  expect(observer.next).toHaveBeenCalledWith(nextBefore);
  expect(observer.error).not.toHaveBeenCalled();
  expect(observer.complete).toHaveBeenCalledTimes(1);
});
