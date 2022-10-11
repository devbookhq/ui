import { Terminal as T, withCasing } from '@devbookhq/react'

export function Icon() {
  return <div>Terminal</div>
}

const TerminalWithCasing = withCasing(T)

function Terminal() {
  return (
    <div className="flex">
      <TerminalWithCasing />
    </div>
  )
}

export default Terminal
