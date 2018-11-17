import flatten from './flatten';

test('no flattening needed', () => {
  const result = flatten(['a', 'b']);
  expect(result).toEqual(['a', 'b']);
});

test('simple flattening', () => {
  const result = flatten(['a', 'b', ['c', 'd']]);
  expect(result).toEqual(['a', 'b', 'c', 'd']);
});

test('nested flattening', () => {
  const result = flatten(['a', [['b']], [['c'], 'd']]);
  expect(result).toEqual(['a', 'b', 'c', 'd']);
});

test('nested flattening with limit', () => {
  const result = flatten(['a', [['b']], [['c'], 'd']], 1);
  expect(result).toEqual(['a', ['b'], ['c'], 'd']);
});
