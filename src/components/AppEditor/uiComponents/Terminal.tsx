import { Terminal as T } from '@devbookhq/react'
import { TerminalSquare } from 'lucide-react'
import { ComponentProps } from 'react'

export function Icon() {
  return <TerminalSquare size="20px" />
}

function Terminal(props: ComponentProps<typeof T>) {
  return (
    <div
      className="
    m-0.5
    flex
    flex-1
    flex-col
    overflow-hidden
    rounded-lg
  "
    >
      <T {...props} />
    </div>
  )
}

export default Terminal
