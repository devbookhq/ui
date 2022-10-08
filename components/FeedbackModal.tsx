import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useState } from 'react'

import Button from 'components/Button'
import Modal from 'components/Modal'
import Textarea from 'components/Textarea'
import SpinnerIcon from 'components/icons/Spinner'

import { upsertUserFeedback } from 'utils/queries'
import useUserInfo from 'utils/useUserInfo'

export interface Props {
  isOpen: boolean
  onClose: () => void
}

function FeedbackModal({ isOpen, onClose }: Props) {
  const [feedback, setFeedback] = useState('')
  const [isSavingFeedback, setIsSavingFeedback] = useState(false)
  const { user } = useUserInfo()

  async function saveFeedback(e: any) {
    e.preventDefault()
    if (!user?.id) return
    if (!feedback) return
    if (isSavingFeedback) return

    setIsSavingFeedback(true)

    await upsertUserFeedback(supabaseClient, user.id, feedback)

    setIsSavingFeedback(false)
    onClose()
  }

  return (
    <Modal
      title="Your Feedback"
      isOpen={isOpen}
      onClose={onClose}
    >
      {isSavingFeedback && <SpinnerIcon className="m-auto" />}
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
