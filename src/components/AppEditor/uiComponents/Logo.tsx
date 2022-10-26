import { Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

export function Icon() {
  return <ImageIcon size="20px" />
}

export interface Props {
  src?: string
}

function Logo({ src }: Props) {
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
