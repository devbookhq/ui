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
      title="Create new app"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div
        className="
        mt-4
        w-full
        flex
        flex-col
        items-center
        justify-center
        space-y-8
      "
      >
        <div
          className="
          w-full
          flex
          flex-col
          items-center
          justify-center
          space-y-4
        "
        >
          <Input
            wrapperClassName="w-full"
            title="Title"
            value={title}
            onChange={handleTitleChange}
            placeholder="App title"
            onEnterDown={handleCreateButtonClick}
          />
        </div>
        <Button
          variant={Button.variant.Full}
          text={isLoading ? 'Creating...' : 'Create App'}
          icon={isLoading ? <SpinnerIcon /> : null}
          isDisabled={isLoading}
          onClick={handleCreateButtonClick}
        />
      </div>
    </Modal>
  )
}

export default NewAppModal
