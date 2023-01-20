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
          className="cursor-pointer whitespace-nowrap text-slate-400 transition-all hover:text-green-800"
          size={Text.size.S2}
          text="Feedback"
        />
      </div>
    </>
  )
}

export default Feedback
