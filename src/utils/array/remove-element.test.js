import removeElement from './remove-element';

test('no match', () => {
  const array = ['a', 'b'];
  const result = removeElement(array, 'c');
  expect(result).toBe(false);
  expect(array).toEqual(['a', 'b']);
});

test('one match', () => {
  const array = ['a', 'b', 'c'];
  const result = removeElement(array, 'b');
  expect(result).toBe(true);
  expect(array).toEqual(['a', 'c']);
});

test('multiple matches', () => {
  const array = ['a', 'b', 'a', 'c'];
  const result = removeElement(array, 'a');
  expect(result).toBe(true);
  expect(array).toEqual(['b', 'c']);
});
