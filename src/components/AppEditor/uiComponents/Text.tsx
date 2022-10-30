import clsx from 'clsx'
import { Type as TypeIcon } from 'lucide-react'

export function Icon() {
  return <TypeIcon size="20px" />
}

export interface Props {
  text?: string
  size?: 'xs' | 'base' | '2xl'
  weight?: 'bold' | 'normal'
  isInEditor?: boolean
}

function Text({ text, size = 'base', isInEditor, weight = 'normal' }: Props) {
  const cls = `text-${size} text-slate-800 items-center flex flex-1`

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
      <div
        className={cls}
        style={{
          fontWeight: weight,
        }}
      >
        {text}
      </div>
    </div>
  )
}

export default Text
