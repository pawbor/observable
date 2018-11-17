import sameContent from './same-content';

const object = { sameRef: true };

/** @type {*} */
const array = ['same-ref'];

test.each([
  [[1], [1], true],
  [[1], [2], false],
  [['foo'], ['foo'], true],
  [['foo'], ['bar'], false],
  [[true], [true], true],
  [[true], [false], false],
  [[object], [object], true],
  [[{}], [{}], false],
  [[array], [array], true],
  [[[]], [[]], false],
  [[1, 2, 3, 4], [1, 2, 3, 4], true],
  [[1, 2, 3, 4], [1, 2, 3], false],
])('sameContent(%j, %j) === %s', (v1, v2, expectedResult) => {
  const result = sameContent(v1, v2);
  expect(result).toBe(expectedResult);
});
