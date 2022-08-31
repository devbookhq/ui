/* eslint-disable @typescript-eslint/no-non-null-assertion */
export function createDeferredPromise<T = void>() {
  let resolve: ((value: T) => void)
  let reject: ((reason?: unknown) => void)
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return {
    resolve: resolve!,
    reject: reject!,
    promise,
  }
}
