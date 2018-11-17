import identity from './identity';

test('returns first argument', () => {
  expect(identity(10)).toBe(10);
  expect(identity('foo')).toBe('foo');
});
