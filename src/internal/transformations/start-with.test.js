import { sequence } from 'utils/array';
import { noop } from 'utils/fp';

import Observable from '../observable';
import startWith from './start-with';
import Observer from '../observer';

test('emits initial values when subscribed', () => {
  const observable = new Observable(noop);
  const expectedSequence = sequence(10);

  const observer = jest.fn();
  observable.transform(startWith(expectedSequence)).subscribe(observer);

  expect(observer).toHaveBeenCalledTimes(expectedSequence.length);
  expectedSequence.forEach((value, index) => {
    expect(observer).toHaveBeenNthCalledWith(index + 1, value);
  });
});

test('can break out from infinite iterable with transformation', () => {
  const infiniteSequence = generateInfiniteSequence();
  const observable = new Observable(noop);

  const observer = { complete: jest.fn() };
  const subscription = observable
    .transform(startWith(infiniteSequence))
    .transform(
      (externalObserver) => new Observer(() => externalObserver.complete())
    )
    .subscribe(observer);

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

  const observer = { next: jest.fn(), error: jest.fn() };
  observable.transform(startWith([1])).subscribe(observer);

  expect(observer.next).toHaveBeenCalledWith(1);
  expect(observer.error).toHaveBeenCalledTimes(1);
  expect(observer.error).toHaveBeenCalledWith(error);
});

test('re-emits complete', () => {
  const observable = Observable.empty();

  const observer = { next: jest.fn(), complete: jest.fn() };
  observable.transform(startWith([1])).subscribe(observer);

  expect(observer.next).toHaveBeenCalledWith(1);
  expect(observer.complete).toHaveBeenCalledTimes(1);
});
