import sequence from './sequence';

test('sequence of defined length and default options', () => {
  const result = sequence(3);
  expect(result).toEqual([0, 1, 2]);
});

test('sequence with explicit increment', () => {
  const result = sequence(3, { increment: 2 });
  expect(result).toEqual([0, 2, 4]);
});

test('sequence with explicit start', () => {
  const result = sequence(3, { start: 5 });
  expect(result).toEqual([5, 6, 7]);
});
