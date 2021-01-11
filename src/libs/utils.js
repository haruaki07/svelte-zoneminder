/**
 * @param {string} str
 * @param {string} search
 */
export const startsWith = (str, search) =>
  str.substr(0, search.length) === search;

/**
 * @param {number[]} arr
 * @param {function} func
 * @return {number}
 */
export const sumBy = (arr, func) =>
  arr.reduce((acc, item) => acc + func(item), 0);
