import { useState } from 'react'


import FeedbackModal from './FeedbackModal'
import Button from 'components/Button'

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
