import compose from './compose';
import identity from './identity';

test('compose() returns identity', () => {
  const result = compose();
  expect(result).toBe(identity);
});

test('compose(fn1, fn2) is like x => fn1(fn2(x))', () => {
  const add2 = (/** @type {number} */ x) => x + 2;
  const multiply3 = (/** @type {number} */ x) => x * 3;

  const result1 = compose(
    add2,
    multiply3
  )(10);
  expect(result1).toBe(32);

  const result2 = compose(
    multiply3,
    add2
  )(10);
  expect(result2).toBe(36);
});

test('can compose multiple functions', () => {
  const length = 10;
  const increment = 2;
  const fns = Array.from({ length }, () => jest.fn((x) => x + increment));

  const result = compose(...fns)(0);
  expect(result).toBe(length * increment);
  fns.forEach((fn, index) => {
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith((length - 1 - index) * increment);
  });
});
