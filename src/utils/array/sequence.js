/**
 * @param {number} length
 * @param {Object} param1
 * @param {number} [param1.increment]
 * @param {number} [param1.start]
 */
export default function sequence(length, { increment = 1, start = 0 } = {}) {
  return Array.from({ length }, (_, i) => start + i * increment);
}
