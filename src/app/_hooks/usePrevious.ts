import React, { useRef, useEffect } from 'react'

function usePrevious(value: any) {
  const ref = useRef();

  useEffect(() => {
    //assign the value of ref to the argument
    if (Array.isArray(value)) {
      ref.current = [...value]
    } else {
      ref.current = value; 
    }
  },[value]);

  return ref.current;
}

export default usePrevious