function getLast<T>(items: T[]) {
  if (items.length > 0) {
    return items[items.length - 1]
  }
}

/**
 * @param items Sorted array of integers
 */
export function findSequences(items: number[]) {
  return items.reduce<number[][]>((seq, item) => {
    const lastSequence = getLast(seq)
    const lastItem = lastSequence ? getLast(lastSequence) : undefined

    if (lastItem === item - 1) {
      lastSequence?.push(item)
    } else {
      seq.push([item])
    }

    return seq
  }, [])
}
