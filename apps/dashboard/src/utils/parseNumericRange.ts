export function parseNumericRange(range: string) {
  let res = []
  let m

  for (let str of range.split(',').map((str) => str.trim())) {
    if (/^-?\d+$/.test(str)) {
      res.push(parseInt(str, 10))
    } else if (
      (m = str.match(/^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/))
    ) {
      // 1-5 or 1..5 (equivalent) or 1...5 (doesn't include 5)
      let [_, l, sep, r] = m


      if (l && r) {
        let lhs = parseInt(l)
        let rhs = parseInt(r)
        const incr = lhs < rhs ? 1 : -1

        if (sep === '-' || sep === '..' || sep === '\u2025') rhs += incr

        for (let i = lhs; i !== rhs; i += incr) res.push(i)
      }
    }
  }
  return res
}
