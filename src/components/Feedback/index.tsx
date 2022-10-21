import { useState } from 'react'

import Text from 'components/typography/Text'

import FeedbackModal from './FeedbackModal'

function Feedback() {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false)

  return (
    <>
      <FeedbackModal
        isOpen={isFeedbackVisible}
        onClose={() => setIsFeedbackVisible(false)}
      />
      <div onClick={() => setIsFeedbackVisible(true)}>
        <Text
          className="cursor-pointer whitespace-nowrap text-slate-400 transition-colors hover:text-amber-800"
          size={Text.size.T1}
          text="Feedback"
        />
      </div>
    </>
  )
}

export default Feedback
