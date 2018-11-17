import withoutElement from './without-element';

test('no match', () => {
  const array = ['a', 'b'];
  const result = withoutElement(array, 'c');
  expect(result).toEqual(['a', 'b']);
});

test('one match', () => {
  const array = ['a', 'b', 'c'];
  const result = withoutElement(array, 'b');
  expect(result).toEqual(['a', 'c']);
});

test('multiple matches', () => {
  const array = ['a', 'b', 'a', 'c'];
  const result = withoutElement(array, 'a');
  expect(result).toEqual(['b', 'c']);
});
