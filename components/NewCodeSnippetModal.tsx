import {
  useState,
} from 'react'

import type { Template } from 'types'
import Modal from 'components/Modal'
import Button from 'components/Button'
import Select from 'components/Select'
import Input from 'components/Input'
import SpinnerIcon from 'components/icons/Spinner'

const templates: Template[] = [
  { name: 'Node.js', value: 'Nodejs' },
  { name: 'Go', value: 'Go' },
  { name: 'Bash', value: 'Bash' },
  { name: 'Python3', value: 'Python3' },
]

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreateCodeSnippetClick: ({ template, title }: { template: Template, title: string }) => void
  isLoading: boolean
}

function NewCodeSnippetModal({
  isOpen,
  onClose,
  onCreateCodeSnippetClick,
  isLoading,
}: Props) {
  const [title, setTitle] = useState('')
  // TODO: allow selecting templates
  const [selectedTmpl, setSelectedTmpl] = useState(templates[0])

  function handleTitleChange(e: any) {
    setTitle(e.target.value)
  }

  function handleCreateButtonClick() {
    if (!selectedTmpl) return

    onCreateCodeSnippetClick({
      template: selectedTmpl,
      title,
    })
  }

  return (
    <Modal
      title="Create new code snippet"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="
        mt-4
        w-full
        flex
        flex-col
        items-center
        justify-center
        space-y-8
      ">
        <div className="
          w-full
          flex
          flex-col
          items-center
          justify-center
          space-y-4
        ">
          <Input
            wrapperClassName="w-full"
            title="Title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Code snippet title"
            onEnterDown={handleCreateButtonClick}
          />
          <Select
            wrapperClassName="w-full"
            title="Template"
            items={templates}
            value={selectedTmpl}
            onChange={i => setSelectedTmpl({ name: i.name, value: i.value as any })}
          />
        </div>
        <Button
          variant={Button.variant.Full}
          text={isLoading ? 'Creating...' : 'Create Code Snippet'}
          icon={isLoading ? <SpinnerIcon /> : null}
          isDisabled={isLoading}
          onClick={handleCreateButtonClick}
        />
      </div>
    </Modal>
  )
}

export default NewCodeSnippetModal
