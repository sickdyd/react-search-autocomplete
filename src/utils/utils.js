export function debounce(func, wait, immediate) {
  var timeout
  return function () {
    var context = this,
      args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    if (immediate && !timeout) func.apply(context, args)
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * This function will return the cachedValues if they exist or false if not
 *
 * @param {string} keyword The string the user is searching
 */

export const isCached = (keyword) => {
  keyword = keyword.toLowerCase()
  const cachedValues = JSON.parse(sessionStorage.getItem(keyword.toLowerCase()))

  if (cachedValues) return cachedValues
  return []
}
