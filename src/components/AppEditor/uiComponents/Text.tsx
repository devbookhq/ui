import clsx from 'clsx'
import { Type as TypeIcon } from 'lucide-react'

export function Icon() {
  return <TypeIcon size="20px" />
}

export interface Props {
  text?: string
  size?: 'xs' | 'base' | '2xl'
  isInEditor?: boolean
}

function Text({ text, size = 'base', isInEditor }: Props) {
  const cls = `text-${size} text-slate-800`

  return (
    <div
      className={clsx(
        { 'outline-dashed outline-1': !text && isInEditor },
        `m-1
        flex
        flex-1
        flex-col
        overflow-hidden
        rounded-lg
        outline-slate-300
        transition-all`,
      )}
    >
      <div className={cls}>{text}</div>
    </div>
  )
}

export default Text
