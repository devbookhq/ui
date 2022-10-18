import { Terminal as T, withCasing } from '@devbookhq/react'
import { ComponentProps } from 'react'

export function Icon() {
  return <div>Terminal</div>
}

const TerminalWithCasing = withCasing(T)

function Terminal(props: ComponentProps<typeof T>) {
  return (
    <div className="flex">
      <TerminalWithCasing {...props} />
    </div>
  )
}

export default Terminal
