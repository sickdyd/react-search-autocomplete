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
