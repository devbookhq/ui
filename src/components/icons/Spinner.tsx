import { Loader2 as Loader } from 'lucide-react'

export interface Props {
  className?: string
}

function Spinner({ className }: Props) {
  return (
    <Loader className={`animate-spin stroke-gray-400 ${className ? className : ''}`} />
  )
}

export default Spinner
