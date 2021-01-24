import { useEffect, useRef } from 'react'

export const useEffectSkipFirstRender = (effect, deps) => {
  const initialRender = useRef(true)

  useEffect(() => {
    let effectReturns

    if (initialRender.current) {
      initialRender.current = false
    } else {
      effectReturns = effect()
    }

    if (effectReturns && typeof effectReturns === 'function') {
      return effectReturns
    }
  }, deps)
}
