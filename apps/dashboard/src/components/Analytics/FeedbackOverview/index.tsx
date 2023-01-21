import useAppFeedback from 'hooks/useAppFeedback'
import { useMemo } from 'react'
import { formatGuidesFeedback } from 'utils/analytics'

export interface Props {
  appId: string
}

function App({ appId }: Props) {
  const { feedback } = useAppFeedback(appId)

  const perGuideFeedback = useMemo(() => formatGuidesFeedback(feedback), [feedback])


  return (
    <div>

    </div>
  )
}

export default App
