import { sequence } from 'utils/array';
import { identity } from 'utils/fp';

import Observable from '../observable';
import filter from './filter';

test('re-emits only matching values', () => {
  const observable = Observable.fromIterable(sequence(10));
  const predicate = (/** @type {number} */ value) => Boolean(value % 2);
  const expectedSequence = sequence(5, { increment: 2, start: 1 });

  const observer = jest.fn();
  observable.transform(filter(predicate)).subscribe(observer);

  expect(observer).toHaveBeenCalledTimes(expectedSequence.length);
  expectedSequence.forEach((value, index) => {
    expect(observer).toHaveBeenNthCalledWith(index + 1, value);
  });
});

test('re-emits errors', () => {
  const error = new Error();
  const observable = Observable.error(error);

  const observer = { error: jest.fn() };
  observable.transform(filter(identity)).subscribe(observer);

  expect(observer.error).toHaveBeenCalledTimes(1);
  expect(observer.error).toHaveBeenCalledWith(error);
});

test('re-emits complete', () => {
  const observable = Observable.empty();

  const observer = { complete: jest.fn() };
  observable.transform(filter(identity)).subscribe(observer);

  expect(observer.complete).toHaveBeenCalledTimes(1);
});
