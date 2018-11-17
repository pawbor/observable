/**
 * @template T
 * @param {T[]} array
 * @param {T} element
 * @returns {T[]}
 */
export default function withoutElement(array, element) {
  const index = array.indexOf(element);
  if (index > -1) {
    const newArray = [...array.slice(0, index), ...array.slice(index + 1)];
    return withoutElement(newArray, element);
  } else {
    return array;
  }
}
