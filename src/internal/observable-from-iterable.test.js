import ObservableFromIterable from './observable-from-iterable';
import Observer from './observer';

test('emits data from iterable when subscribed', () => {
  const iterable = {
    [Symbol.iterator]: function* data() {
      yield 1;
      yield 'foo';
      yield false;
    },
  };

  const observable = ObservableFromIterable(iterable);

  const observer1 = jest.fn();
  const observer2 = jest.fn();
  observable.subscribe(observer1);
  const subscription2 = observable.subscribe(
    observer2.mockImplementation(() => subscription2.unsubscribe())
  );

  expect(observer1).toHaveBeenCalledTimes(3);
  expect(observer2).toHaveBeenCalledTimes(1);

  expect(observer1).toHaveBeenNthCalledWith(1, 1);
  expect(observer2).toHaveBeenNthCalledWith(1, 1);

  expect(observer1).toHaveBeenNthCalledWith(2, 'foo');

  expect(observer1).toHaveBeenNthCalledWith(3, false);
});

test('can break out from infinite iterable with transformation', () => {
  const infiniteSequence = generateInfiniteSequence();
  const observable = ObservableFromIterable(infiniteSequence);

  const observer = { complete: jest.fn() };
  const subscription = observable
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

test('completes after emitting all data', () => {
  const data = [1, 2, 3];
  const observable = ObservableFromIterable(data);

  const observer = {
    next: jest.fn(),
    complete: jest.fn(() => {
      expect(observer.next).toHaveBeenCalledTimes(data.length);
    }),
  };
  const subscription = observable.subscribe(observer);

  expect(observer.complete).toHaveBeenCalledTimes(1);
  expect(subscription.isClosed).toBe(true);
});
