import {
  useState,
  useEffect,
} from 'react'

import { CodeSnippetEmbedTelemetryType } from 'types'
import { getEmbedsTelemetry } from 'utils/supabaseClient'
import useUserInfo from 'utils/useUserInfo'
import Title from 'components/typography/Title'
import AnalyticsCard, { Item } from 'components/AnalyticsCard'


function Insights() {
  const { user } = useUserInfo()
  const [runData, setRunData] = useState<Item[]>()
  const [copyData, setCopyData] = useState<Item[]>()

  useEffect(function getTelemetry() {
    if (!user?.id) {
      setRunData([])
      setCopyData([])
      return
    }

    getEmbedsTelemetry(user.id)
    .then(results => {
      const r = results.reduce((acc, current) => {
          const csID = current.code_snippet.id

          let runCount = acc[csID]?.runCount || 0
          let copyCount = acc[csID]?.copyCount || 0
          if (current.type === CodeSnippetEmbedTelemetryType.RunCodeEmbed) {
            runCount += 1
          }
          if (current.type === CodeSnippetEmbedTelemetryType.CopyCodeEmbed) {
            copyCount += 1
          }

          return {
            ...acc,
            [csID]: {
              id: csID,
              title: current.code_snippet.title,
              runCount,
              copyCount,
            }
          }
        }, {})

      const runs = Object.values<any>(r)
        .map(el => ({...el, count: el.runCount}))
        .sort((a, b) => b.count - a.count)
      setRunData(runs)

      const copies = Object.values<any>(r)
        .map(el => ({...el, count: el.copyCount}))
        .sort((a, b) => b.count - a.count)
      setCopyData(copies)
    })
  }, [user?.id])

  return (
    <div className="
      flex-1
      flex
      flex-col
      items-start
      space-y-6
    ">
      <Title
        title="Insights"
      />

      <div className="
        w-full
        flex
        flex-col
        items-start
        justify-start
        space-y-4

        md:flex-row
        md:flex-wrap
        md:space-y-0
        md:gap-4
      ">
        <AnalyticsCard
          title="Most executed code snippets"
          items={runData}
        />

        <AnalyticsCard
          title="Most copied code snippets"
          items={copyData}
        />
      </div>
    </div>
  )
}

export default Insights
