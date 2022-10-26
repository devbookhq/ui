import { Type as TypeIcon } from 'lucide-react'

export function Icon() {
  return <TypeIcon size="20px" />
}

export interface Props {
  text?: string
  size?: 'xs' | 'base' | '2xl'
}

function Text({ text, size = 'base' }: Props) {
  const cls = `text-${size} text-slate-800`

  return (
    <div
      className="
    m-1
    flex
    flex-1
    flex-col
    overflow-hidden
    rounded-lg
  "
    >
      <div className={cls}>{text}</div>
    </div>
  )
}

export default Text
