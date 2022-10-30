import clsx from 'clsx'
import { Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

export function Icon() {
  return <ImageIcon size="20px" />
}

export interface Props {
  src?: string
  isInEditor?: boolean
}

function Logo({ src, isInEditor }: Props) {
  return (
    <div
      className={clsx(
        { 'outline-dashed outline-1': !src && isInEditor },
        `m-1
        flex
        flex-1
        flex-col
        overflow-hidden
        rounded-lg
        outline-slate-300`,
      )}
    >
      {src && (
        <Image
          alt="logo"
          layout="fill"
          src={src}
        />
      )}
    </div>
  )
}

export default Logo
