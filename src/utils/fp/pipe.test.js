import pipe from './pipe';
import identity from './identity';

test('pipe() returns identity', () => {
  const result = pipe();
  expect(result).toBe(identity);
});

test('pipe(fn1, fn2) is like x => fn2(fn1(x))', () => {
  const add2 = (/** @type {number} */x) => x + 2;
  const multiply3 = (/** @type {number} */x) => x * 3;

  const result1 = pipe(
    add2,
    multiply3
  )(10);
  expect(result1).toBe(36);

  const result2 = pipe(
    multiply3,
    add2
  )(10);
  expect(result2).toBe(32);
});

test('can pipe multiple functions', () => {
  const length = 10;
  const increment = 2;
  const fns = Array.from({ length }, () => jest.fn((x) => x + increment));

  const result = pipe(...fns)(0);
  expect(result).toBe(length * increment);
  fns.forEach((fn, index) => {
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(index * increment);
  });
});
