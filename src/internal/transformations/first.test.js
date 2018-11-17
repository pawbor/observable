import { identity } from 'utils/fp';

import Observable from '../observable';
import first from './first';

test('re-emits first matching value and completes', () => {
  const infiniteSequence = generateInfiniteSequence();
  const infiniteStream = Observable.fromIterable(infiniteSequence);
  const predicate = (/** @type {number} */ value) => Boolean(value % 2);

  const observer = { next: jest.fn(), complete: jest.fn() };
  const subscription = infiniteStream
    .transform(first(predicate))
    .subscribe(observer);

  expect(observer.next).toHaveBeenCalledTimes(1);
  expect(observer.next).toHaveBeenCalledWith(1);
  expect(observer.complete).toHaveBeenCalledTimes(1);
  expect(subscription.isClosed).toBe(true);

  function* generateInfiniteSequence() {
    let counter = 0;
    while (true) {
      yield counter++;
    }
  }
});

test('re-emits errors', () => {
  const error = new Error();
  const observable = Observable.error(error);

  const observer = { error: jest.fn() };
  observable.transform(first(identity)).subscribe(observer);

  expect(observer.error).toHaveBeenCalledTimes(1);
  expect(observer.error).toHaveBeenCalledWith(error);
});

test('re-emits complete', () => {
  const observable = Observable.empty();

  const observer = { complete: jest.fn() };
  observable.transform(first(identity)).subscribe(observer);

  expect(observer.complete).toHaveBeenCalledTimes(1);
});
