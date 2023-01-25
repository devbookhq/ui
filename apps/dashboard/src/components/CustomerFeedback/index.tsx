import { useState } from 'react'

import Button from 'components/Button'

import FeedbackModal from './FeedbackModal'

function Feedback() {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false)

  return (
    <>
      <FeedbackModal
        isOpen={isFeedbackVisible}
        onClose={() => setIsFeedbackVisible(false)}
      />
      <Button
        onClick={() => setIsFeedbackVisible(true)}
        text="Feedback"
      />
    </>
  )
}

export default Feedback
