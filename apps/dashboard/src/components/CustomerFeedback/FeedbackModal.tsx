import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { FormEvent, MouseEvent, useState } from 'react'

import Button from 'components/Button'
import Modal from 'components/Modal'
import Textarea from 'components/Textarea'
import SpinnerIcon from 'components/icons/Spinner'
import { Database } from 'queries/supabase'
import { userFeedbackTable } from 'queries/db'

export interface Props {
  isOpen: boolean
  onClose: () => any
}

function FeedbackModal({ isOpen, onClose }: Props) {
  const [feedback, setFeedback] = useState('')
  const [isSavingFeedback, setIsSavingFeedback] = useState(false)
  const user = useUser()

  const supabaseClient = useSupabaseClient<Database>()

  async function saveFeedback(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) {
    e.preventDefault()
    if (!user?.id) return
    if (!feedback) return
    if (isSavingFeedback) return

    setIsSavingFeedback(true)

    const response = await supabaseClient.from(userFeedbackTable).insert({
      user_id: user.id,
      feedback,
    })

    if (response.error) {
      console.error(response.error)
    }

    setIsSavingFeedback(false)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Send us your feedback"
      onClose={onClose}
    >
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
          text={isSavingFeedback ? 'Sending' : 'Send feedback'}
          icon={isSavingFeedback ? <SpinnerIcon className="text-white" /> : null}
          isDisabled={isSavingFeedback || feedback.trim() === ''}
          variant={Button.variant.Full}
          onClick={saveFeedback}
        />
      </form>
    </Modal>
  )
}

export default FeedbackModal
