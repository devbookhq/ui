import { useState } from 'react'
import useUserInfo from 'utils/useUserInfo'

import { upsertUserFeedback } from 'utils/supabaseClient'
import Modal from 'components/Modal'
import Textarea from 'components/Textarea'
import SpinnerIcon from 'components/icons/Spinner'
import Button from 'components/Button'

export interface Props {
  isOpen: boolean
  onClose: () => void
}

function FeedbackModal({
  isOpen,
  onClose,
}: Props) {
  const [feedback, setFeedback] = useState('')
  const [isSavingFeedback, setIsSavingFeedback] = useState(false)
  const { user } = useUserInfo()

  async function saveFeedback(e: any) {
    e.preventDefault()
    if (!user?.id) return
    if (!feedback) return
    if (isSavingFeedback) return

    setIsSavingFeedback(true)

    await upsertUserFeedback(user.id, feedback)

    setIsSavingFeedback(false)
    onClose()
  }

  return (
    <Modal
      title="Your Feedback"
      isOpen={isOpen}
      onClose={onClose}
    >
      {isSavingFeedback && <SpinnerIcon className="m-auto"/>}
      {!isSavingFeedback && (
        <form
          className="
            flex
            flex-col
            items-start
            space-y-4
            w-full
          "
          autoComplete="of"
          onSubmit={saveFeedback}
        >
          <Textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Your feedback..."
          />

          <Button
            variant={Button.variant.Full}
            text="Send"
            onClick={saveFeedback}
          />
        </form>
      )}
    </Modal>
  )
}

export default FeedbackModal
