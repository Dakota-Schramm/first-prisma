import { useState, useEffect, useRef, MutableRefObject } from 'react'

const options = { 
  root: null, 
  // rootMargin: "Opx", 
  threshold: 1.0 
}

const useWindowIntersection = (): [MutableRefObject<any>, boolean] => {
  const containerRef = useRef(null)
  const [ isVisible, setIsVisible ] = useState(false)

  const callbackFunction = (entries) => {
    const [ entry ] = entries
    setIsVisible(entry.isIntersecting)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, options)
    const current = containerRef.current
    if (current) observer.observe(current)

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [containerRef])

  return [containerRef, isVisible]
}

export default useWindowIntersection
