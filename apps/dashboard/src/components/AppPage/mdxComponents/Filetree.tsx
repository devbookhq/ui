import { Filesystem } from '@devbookhq/filesystem'
import { useSharedSession } from '@devbookhq/react'
import { rootdir } from 'utils/constants'

export interface Props {
  root?: string
  ignore?: string[]
}

function Filetree({
  root = rootdir,
  ignore,
}: Props) {
  const { session } = useSharedSession()

  return (
    <Filesystem
      session={session}
      ignore={ignore}
      rootPath={root}
    />
  )
}

export default Filetree
