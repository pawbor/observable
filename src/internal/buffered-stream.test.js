import BufferedStream from './buffered-stream';
import { sequence } from 'utils/array';
import { map } from './transformations';
import Observable from './observable';

describe('Stream', () => {
  test('has subscribe method', () => {
    const observable = new BufferedStream();
    expect(observable).toHaveProperty('subscribe', expect.any(Function));
  });

  test('has transform method', () => {
    const observable = new BufferedStream();
    expect(observable).toHaveProperty('transform', expect.any(Function));
  });
});

test('next emits values to subscribed observers', () => {
  const stream = new BufferedStream();
  const observer1 = jest.fn();
  const observer2 = jest.fn();
  const observer3 = jest.fn();

  const subscription1 = stream.subscribe(
    observer1.mockImplementation(() => subscription1.unsubscribe())
  );
  stream.subscribe(observer2);
  stream.next(1);
  stream.subscribe(observer3);
  stream.next(5);
  stream.next(10);

  expect(observer1).toHaveBeenCalledTimes(1);
  expect(observer2).toHaveBeenCalledTimes(3);
  expect(observer3).toHaveBeenCalledTimes(2);

  expect(observer1).toHaveBeenNthCalledWith(1, 1);
  expect(observer2).toHaveBeenNthCalledWith(1, 1);
  expect(observer3).toHaveBeenNthCalledWith(1, 5);

  expect(observer2).toHaveBeenNthCalledWith(2, 5);
  expect(observer3).toHaveBeenNthCalledWith(2, 10);

  expect(observer2).toHaveBeenNthCalledWith(3, 10);
});

test('error emits first value to subscribed observers and closes stream', () => {
  const stream = new BufferedStream();
  const observer1 = { error: jest.fn() };
  const observer2 = { error: jest.fn() };
  const observer3 = { error: jest.fn() };

  const subscription1 = stream.subscribe(observer1);
  stream.subscribe(observer2).unsubscribe();
  stream.error(1);
  const subscription3 = stream.subscribe(observer3);
  stream.error(5);

  expect(observer1.error).toHaveBeenCalledTimes(1);
  expect(observer2.error).toHaveBeenCalledTimes(0);
  expect(observer3.error).toHaveBeenCalledTimes(0);

  expect(observer1.error).toHaveBeenCalledWith(1);

  expect(subscription1.isClosed).toBe(true);
  expect(subscription3.isClosed).toBe(true);
});

test('complete emits to subscribed observers and closes stream', () => {
  const stream = new BufferedStream();
  const observer1 = { complete: jest.fn() };
  const observer2 = { complete: jest.fn() };
  const observer3 = { complete: jest.fn() };

  const subscription1 = stream.subscribe(observer1);
  stream.subscribe(observer2).unsubscribe();
  stream.complete();
  const subscription3 = stream.subscribe(observer3);
  stream.complete();

  expect(observer1.complete).toHaveBeenCalledTimes(1);
  expect(observer2.complete).toHaveBeenCalledTimes(0);
  expect(observer3.complete).toHaveBeenCalledTimes(0);

  expect(subscription1.isClosed).toBe(true);
  expect(subscription3.isClosed).toBe(true);
});

test('can buffer values', () => {
  const initialValues = ['overflow', 'foo', 'bar'];
  const stream = new BufferedStream(2, initialValues);
  const observer1 = jest.fn();
  const observer2 = jest.fn();

  stream.subscribe(observer1);
  stream.next('1');
  stream.subscribe(observer2);
  stream.next('5');

  expect(observer1).toHaveBeenCalledTimes(4);
  expect(observer2).toHaveBeenCalledTimes(3);

  expect(observer1).toHaveBeenNthCalledWith(1, 'foo');
  expect(observer2).toHaveBeenNthCalledWith(1, 'bar');

  expect(observer1).toHaveBeenNthCalledWith(2, 'bar');
  expect(observer2).toHaveBeenNthCalledWith(2, '1');

  expect(observer1).toHaveBeenNthCalledWith(3, '1');
  expect(observer2).toHaveBeenNthCalledWith(3, '5');

  expect(observer1).toHaveBeenNthCalledWith(4, '5');
});

test('can buffer values', () => {
  const initialValues = ['overflow', 'foo', 'bar'];
  const stream = new BufferedStream(2, initialValues);
  const observer1 = jest.fn();
  const observer2 = jest.fn();

  stream.subscribe(observer1);
  stream.next('1');
  stream.subscribe(observer2);
  stream.next('5');

  expect(observer1).toHaveBeenCalledTimes(4);
  expect(observer2).toHaveBeenCalledTimes(3);

  expect(observer1).toHaveBeenNthCalledWith(1, 'foo');
  expect(observer2).toHaveBeenNthCalledWith(1, 'bar');

  expect(observer1).toHaveBeenNthCalledWith(2, 'bar');
  expect(observer2).toHaveBeenNthCalledWith(2, '1');

  expect(observer1).toHaveBeenNthCalledWith(3, '1');
  expect(observer2).toHaveBeenNthCalledWith(3, '5');

  expect(observer1).toHaveBeenNthCalledWith(4, '5');
});

test('can transform stream', () => {
  const initialValues = sequence(3, { start: 1 });
  const stream = new BufferedStream(2, initialValues);
  const observer1 = jest.fn();

  stream.transform(map((x) => x * 10)).subscribe(observer1);
  stream.next(5);

  expect(observer1).toHaveBeenCalledTimes(3);
  expect(observer1).toHaveBeenNthCalledWith(1, 20);
  expect(observer1).toHaveBeenNthCalledWith(2, 30);
  expect(observer1).toHaveBeenNthCalledWith(3, 50);
});

describe('asReadOnly', () => {
  test('returns observable', () => {
    const stream = new BufferedStream();
    const readOnly = stream.asReadOnly();
    expect(readOnly).toBeInstanceOf(Observable);
  });

  test('hides stream interface', () => {
    const stream = new BufferedStream();
    const readOnly = stream.asReadOnly();
    expect(readOnly).not.toHaveProperty('next');
    expect(readOnly).not.toHaveProperty('error');
    expect(readOnly).not.toHaveProperty('complete');
  });

  test('emits when source stream would', () => {
    const initialValues = sequence(3, { start: 1 });
    const stream = new BufferedStream(2, initialValues);
    const observer1 = jest.fn();

    stream.asReadOnly().subscribe(observer1);
    stream.next(5);

    expect(observer1).toHaveBeenCalledTimes(3);
    expect(observer1).toHaveBeenNthCalledWith(1, 2);
    expect(observer1).toHaveBeenNthCalledWith(2, 3);
    expect(observer1).toHaveBeenNthCalledWith(3, 5);
  });
});
