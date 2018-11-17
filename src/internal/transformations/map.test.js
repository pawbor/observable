import { sequence } from 'utils/array';
import { identity } from 'utils/fp';

import map from './map';
import Observable from '../observable';

test('re-emits mapped values', () => {
  const observable = Observable.fromIterable(sequence(10));
  const mapping = (/** @type {number} */ value) => value + 2;
  const expectedSequence = sequence(10, { start: 2 });

  const observer = jest.fn();
  observable.transform(map(mapping)).subscribe(observer);

  expect(observer).toHaveBeenCalledTimes(expectedSequence.length);
  expectedSequence.forEach((value, index) => {
    expect(observer).toHaveBeenNthCalledWith(index + 1, value);
  });
});

test('re-emits errors', () => {
  const error = new Error();
  const observable = Observable.error(error);

  const observer = { error: jest.fn() };
  observable.transform(map(identity)).subscribe(observer);

  expect(observer.error).toHaveBeenCalledTimes(1);
  expect(observer.error).toHaveBeenCalledWith(error);
});

test('re-emits complete', () => {
  const observable = Observable.empty();

  const observer = { complete: jest.fn() };
  observable.transform(map(identity)).subscribe(observer);

  expect(observer.complete).toHaveBeenCalledTimes(1);
});
