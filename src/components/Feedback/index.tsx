import { useState } from 'react'

import Title from 'components/typography/Title'

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
        <Title
          className="cursor-pointer whitespace-nowrap transition-colors hover:text-gray-600"
          rank={Title.rank.Secondary}
          size={Title.size.T3}
          title="Feedback"
        />
      </div>
    </>
  )
}

export default Feedback
