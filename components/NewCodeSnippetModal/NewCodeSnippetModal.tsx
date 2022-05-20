import {
  useState,
} from 'react'
import Modal from 'components/Modal'
import Button from 'components/Button'
import type { Runtime } from 'types'

import RuntimeItem from './RuntimeItem'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreateCodeSnippetClick: (runtime: Runtime) => void
}

const runtimes: Runtime[] = [
  {
    name: 'Go',
    value: 'Golang',
  },
  {
    name: 'NodeJS',
    value: 'Nodejs',
  },
  {
    name: 'Python',
    value: 'Python',
  },
]

function NewCodeSnippetModal({
  isOpen,
  onClose,
  onCreateCodeSnippetClick,
}: Props) {
  const [selectedRuntime, setSelectedRuntime] = useState(runtimes[0])

  return (
    <Modal
      title="Create new code snippet"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="
        w-full
        flex
        flex-col
        items-center
        justify-center
        space-y-10
      ">
        <div className="
          mt-4
          w-full
          flex
          flex-wrap
          justify-start
          gap-2
        ">
          {runtimes.map(r => (
            <RuntimeItem
              key={r.value}
              runtime={r}
              isSelected={r.value === selectedRuntime.value}
              onClick={setSelectedRuntime}
            />
          ))}
        </div>
        <Button
          variant={Button.variant.Full}
          text="Create Code Snippet"
          onClick={() => onCreateCodeSnippetClick(selectedRuntime)}
        />
      </div>
    </Modal>
  )
}

export default NewCodeSnippetModal
