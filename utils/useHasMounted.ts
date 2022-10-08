import { useEffect, useState } from 'react'

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(function changeMountedState() {
    setHasMounted(true)
  }, [])

  return hasMounted
}

export default useHasMounted
