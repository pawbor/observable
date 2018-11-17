/**
 * @template T
 * @param {T[]} array 
 * @param {T} element 
 */
export default function removeElement(array, element) {
  const index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
    removeElement(array, element);
    return true;
  } else {
    return false;
  }
}
