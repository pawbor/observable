import CombineObservables from './combine-observables';
import BufferedStream from './buffered-stream';

test('subscribes to each stream when subscribed', () => {
  const s1 = spiedStream();
  const s2 = spiedStream();
  const observable = CombineObservables([s1, s2]);
  observable.subscribe();
  expect(s1.subscribe).toHaveBeenCalledTimes(1);
  expect(s2.subscribe).toHaveBeenCalledTimes(1);

  function spiedStream() {
    const stream = new BufferedStream();
    jest.spyOn(stream, 'subscribe');
    return stream;
  }
});

test('starts to emit after each stream emits at least once', () => {
  const s1 = new BufferedStream();
  const s2 = new BufferedStream();
  const s3 = new BufferedStream();
  const stream = CombineObservables([s1, s2, s3]);

  const observer = jest.fn();
  stream.subscribe(observer);
  expect(observer).not.toHaveBeenCalled();

  const values = [1, 'foo', true];

  s1.next(values[0]);
  expect(observer).not.toHaveBeenCalled();

  s2.next(values[1]);
  expect(observer).not.toHaveBeenCalled();

  s3.next(values[2]);
  expect(observer).toHaveBeenCalledWith(values);
});

test('emitted value is combination of last values from each observable', () => {
  const updates = [[1, 'a'], [2, 'b']];
  const expectedCombinations = [[1, 'a'], [2, 'a'], [2, 'b']];

  const s1 = new BufferedStream();
  const s2 = new BufferedStream();
  const stream = CombineObservables([s1, s2]);

  const observer = jest.fn();
  stream.subscribe(observer);

  updates.forEach(([v1, v2]) => {
    s1.next(v1);
    s2.next(v2);
  });

  expect(observer).toHaveBeenCalledTimes(expectedCombinations.length);
  expectedCombinations.forEach((combination, index) => {
    expect(observer).toHaveBeenNthCalledWith(index + 1, combination);
  });
});

test("multiple observers don't impact each other", () => {
  const updates = [[1, 'a'], [2, 'b'], [3, 'c']];

  const s1 = new BufferedStream();
  const s2 = new BufferedStream();
  const stream = CombineObservables([s1, s2]);

  const observersWithExpectations = updates.map(([v1, v2], index) => {
    const observer = jest.fn();
    stream.subscribe(observer);
    s1.next(v1);
    s2.next(v2);
    const expectedFirstCombination = [v1, v2];
    const expectedNumberOfCombinations = (updates.length - index) * 2 - 1;
    return { observer, expectedFirstCombination, expectedNumberOfCombinations };
  });

  observersWithExpectations.forEach(
    ({ observer, expectedFirstCombination, expectedNumberOfCombinations }) => {
      expect(observer).toHaveBeenCalledTimes(expectedNumberOfCombinations);
      expect(observer).toHaveBeenNthCalledWith(1, expectedFirstCombination);
    }
  );
});

test('unsubscribes from all streams when unsubscribed', () => {
  const { stream: s1, unsubscribe: unsubscribe1 } = spiedStream();
  const { stream: s2, unsubscribe: unsubscribe2 } = spiedStream();
  const stream = CombineObservables([s1, s2]);
  stream.subscribe().unsubscribe();
  expect(unsubscribe1).toHaveBeenCalledTimes(1);
  expect(unsubscribe2).toHaveBeenCalledTimes(1);

  function spiedStream() {
    const stream = new BufferedStream();
    const unsubscribe = jest.fn();
    jest.spyOn(stream, 'subscribe').mockReturnValue({ unsubscribe });
    return { stream, unsubscribe };
  }
});

test('unsubscribing do not affect other observers', () => {
  const updatesBefore = { v1: 1, v2: 'a' };
  const updatesAfter = { v1: 2, v2: 'b' };

  const s1 = new BufferedStream();
  const s2 = new BufferedStream();
  const stream = CombineObservables([s1, s2]);

  const observer1 = jest.fn();
  stream.subscribe(observer1);

  const observer2 = jest.fn();
  const subscription = stream.subscribe(observer2);
  
  s1.next(updatesBefore.v1);
  s2.next(updatesBefore.v2);

  subscription.unsubscribe();
  s1.next(updatesAfter.v1);
  s2.next(updatesAfter.v2);

  expect(observer1).toHaveBeenCalledTimes(3);
  expect(observer2).toHaveBeenCalledTimes(1);
});
