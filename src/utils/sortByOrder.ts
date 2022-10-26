export function sortByOrder<I, O>(order: O[], transform: (item: I) => O) {
  return (a: I, b: I) => {
    const aID = transform(a)
    const bID = transform(b)

    if (!aID || !bID) return 0

    return order.indexOf(aID) - order.indexOf(bID)
  }
}

export function identify<T>(item: T) {
  return item
}
