/**
 * Utility functions that are handy for use across the application.
 */

/**
 * cycle(5, [1, 2, 3])  => [1, 2, 3, 1, 2]
 * cycle(2, [1, 2, 3])  => [1, 2]
 * cycle(2, [])         => []
 *
 * Has same signature as underscore.contrib#cycle
 *
 * @param {Int}   n     # elements wanted in the output list.
 * @param {[Any]} list  input array list.
 */
function cycle(n, list) {
  if (n <= 0 || list.length === 0) {
    return []
  }
  if (n < list.length) {
    return list.slice(0, n)
  }
  let i = 0,
      j = list.length
  const listlen = j
  const res = list.slice(0)   // make copy of our input array.
  while (j < n) {
    res.push(list[i])
    i = (i + 1) % listlen
    j += 1
  }
  return res
}

module.exports = cycle
