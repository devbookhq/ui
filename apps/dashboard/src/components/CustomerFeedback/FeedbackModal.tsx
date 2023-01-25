import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { FormEvent, MouseEvent, useState } from 'react'

import Button from 'components/Button'
import Modal from 'components/Modal'
import Textarea from 'components/Textarea'
import SpinnerIcon from 'components/icons/Spinner'

import { insertUserFeedback } from 'queries'

export interface Props {
  isOpen: boolean
  onClose: () => any
}

function FeedbackModal({ isOpen, onClose }: Props) {
  const [feedback, setFeedback] = useState('')
  const [isSavingFeedback, setIsSavingFeedback] = useState(false)
  const { user } = useUser()

  async function saveFeedback(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) {
    e.preventDefault()
    if (!user?.id) return
    if (!feedback) return
    if (isSavingFeedback) return

    setIsSavingFeedback(true)

    await insertUserFeedback(supabaseClient, user.id, feedback)

    setIsSavingFeedback(false)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Send us your feedback"
      onClose={onClose}
    >
      {isSavingFeedback && <SpinnerIcon className="m-auto text-slate-400" />}
      {!isSavingFeedback && (
        <form
          autoComplete="of"
          className="
            flex
            w-full
            flex-col
            items-center
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
            text="Send feedback"
            variant={Button.variant.Full}
            onClick={saveFeedback}
          />
        </form>
      )}
    </Modal>
  )
}

export default FeedbackModal
