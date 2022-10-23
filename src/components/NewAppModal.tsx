import { ChangeEvent, useState } from 'react'

import Button from 'components/Button'
import Input from 'components/Input'
import Modal from 'components/Modal'
import SpinnerIcon from 'components/icons/Spinner'

import { App } from 'queries/types'

import { createID, createRandomTitle } from 'utils/app'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreate: (app: Pick<App, 'id' | 'title'>) => void
  isLoading: boolean
}

function NewAppModal({ isOpen, onClose, onCreate, isLoading }: Props) {
  const [title, setTitle] = useState(createRandomTitle)

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
  }

  function handleCreateButtonClick() {
    onCreate({
      title: title ? title : createRandomTitle(),
      id: createID(),
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Create a new app"
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
            placeholder="App name"
            title="Name"
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
