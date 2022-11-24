import { useCallback, useState } from 'react'

const dynamicPortRangeStart = 49152
const dynamicPortRangeEnd = 65535

function getCyclicRangeIterator(start: number, end: number) {
  return function (current: number) {
    return current >= end ? start : current + 1
  }
}

const getNextInRange = getCyclicRangeIterator(dynamicPortRangeStart, dynamicPortRangeEnd)

function useMaybeEmptyPort() {
  const [port, setPort] = useState(dynamicPortRangeStart)

  const markPortAsNotEmpty = useCallback(() => {
    setPort(getNextInRange)
  }, [])

  return {
    maybeEmptyPort: port,
    markPortAsNotEmpty,
  }
}

export default useMaybeEmptyPort
