import { useState } from 'react'
import { useRouter } from 'next/router'

import { upsertUserFeedback } from 'utils/supabaseClient'
import useUserInfo from 'utils/useUserInfo'
import TitleLink from 'components/TitleLink'
import Button from 'components/Button'
import UserIndicator from 'components/UserIndicator'
import Modal from 'components/Modal'
import Textarea from 'components/Textarea'
import SpinnerIcon from 'components/icons/Spinner'

function Navbar() {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [isSavingFeedback, setIsSavingFeedback] = useState(false)

  const router = useRouter()
  const { user } = useUserInfo()


  function handleFeedbackClick() {
    setIsFeedbackVisible(true)
  }

  async function saveFeedback(e: any) {
    e.preventDefault()
    if (!user?.id) return
    if (!feedback) return
    if (isSavingFeedback) return

    setIsSavingFeedback(true)

    await upsertUserFeedback(user.id, feedback)

    setIsSavingFeedback(false)
    setIsFeedbackVisible(false)
  }

  if (!user) return null
  return (
    <>
    <Modal
      title="Your Feedback"
      isOpen={isFeedbackVisible}
      onClose={() => setIsFeedbackVisible(false)}
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
    <header
      className="
        flex
        flex-row
        justify-between
        items-center
    ">
      <span />

      <nav className="
        flex
        flex-row
        items-center
        space-x-6
      ">
        <Button
          text="Leave feedback"
          onClick={handleFeedbackClick}
        />
        <TitleLink
          href={{
            pathname: '/',
          }}
          title="Dashboard"
          size={TitleLink.size.T3}
        />
        <TitleLink
          href={{
            pathname: '/settings',
          }}
          title="Settings"
          size={TitleLink.size.T3}
        />
        <UserIndicator
          onMouseDown={() => router.push('/settings')}
          userDisplayName={user.email}
          size={UserIndicator.size.Large}
        />
      </nav>
    </header>
    </>
  )
}


export default Navbar
