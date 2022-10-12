import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useState } from 'react'

import Button from 'components/Button'
import Modal from 'components/Modal'
import Textarea from 'components/Textarea'
import SpinnerIcon from 'components/icons/Spinner'

import { upsertUserFeedback } from 'utils/queries/queries'

import useUserInfo from 'hooks/useUserInfo'

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
      isOpen={isOpen}
      title="Your Feedback"
      onClose={onClose}
    >
      {isSavingFeedback && <SpinnerIcon className="m-auto" />}
      {!isSavingFeedback && (
        <form
          autoComplete="of"
          className="
            flex
            w-full
            flex-col
            items-start
            space-y-4
          "
          onSubmit={saveFeedback}
        >
          <Textarea
            placeholder="Your feedback..."
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
          />

          <Button
            text="Send"
            variant={Button.variant.Full}
            onClick={saveFeedback}
          />
        </form>
      )}
    </Modal>
  )
}

export default FeedbackModal
