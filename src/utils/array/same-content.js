/**
 * @param {any[]} arr1
 * @param {any[]} arr2
 * @returns {boolean}
 */
export default function sameContent(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((el1, index) => {
    const el2 = arr2[index];
    return el1 === el2;
  });
}
