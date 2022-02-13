export function debounce(func: Function, wait: number, immediate?: boolean) {
  let timeout: NodeJS.Timeout | null

  return function (this: any) {
    const context = this
    const args = arguments

    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    if (immediate && !timeout) func.apply(context, args)

    timeout && clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
