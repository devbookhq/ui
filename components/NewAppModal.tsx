import { useState } from 'react'

import Button from 'components/Button'
import Input from 'components/Input'
import Modal from 'components/Modal'
import SpinnerIcon from 'components/icons/Spinner'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreate: ({ title }: { title: string }) => void
  isLoading: boolean
}

function NewAppModal({ isOpen, onClose, onCreate, isLoading }: Props) {
  const [title, setTitle] = useState('')

  function handleTitleChange(e: any) {
    setTitle(e.target.value)
  }

  function handleCreateButtonClick() {
    onCreate({
      title,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Create new app"
      onClose={onClose}
    >
      <div
        className="
        mt-4
        flex
        w-full
        flex-col
        items-center
        justify-center
        space-y-8
      "
      >
        <div
          className="
          flex
          w-full
          flex-col
          items-center
          justify-center
          space-y-4
        "
        >
          <Input
            placeholder="App title"
            title="Title"
            value={title}
            wrapperClassName="w-full"
            onChange={handleTitleChange}
            onEnterDown={handleCreateButtonClick}
          />
        </div>
        <Button
          icon={isLoading ? <SpinnerIcon /> : null}
          isDisabled={isLoading}
          text={isLoading ? 'Creating...' : 'Create App'}
          variant={Button.variant.Full}
          onClick={handleCreateButtonClick}
        />
      </div>
    </Modal>
  )
}

export default NewAppModal
