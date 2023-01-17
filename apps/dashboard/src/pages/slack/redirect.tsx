import Text from 'components/typography/Text'
import { useRouter } from 'next/router'


function SlackRedirect() {
  const router = useRouter()

  const code = router.query.code
  const state = router.query.state

  return (
    <div className="flex flex-1 bg-slate-100">
      <div
        className="
          flex
          flex-1
          items-center
          justify-center
        "
      >
        <Text text="Connect Slack with your Devbook App" />
      </div>
    </div>
  )
}

export default SlackRedirect
