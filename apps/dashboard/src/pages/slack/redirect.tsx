import Spinner from 'components/icons/Spinner'
import Text from 'components/typography/Text'
import { GetServerSideProps } from 'next'

const appId = 'prisma-hub'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      permanent: false,
      destination: `/api/slack/oauth_redirect?code=${context.query.code}&state=${context.query.state}&appId=${appId}`
    }
  }
}

function SlackRedirect() {
  return (
    <div className="flex flex-1 bg-slate-100">
      <div
        className="
          flex
          flex-1
          flex-col
          items-center
          justify-center
          space-y-2
        "
      >
        <Spinner />
        <Text text="Connecting Slack with Devbook App" />
      </div>
    </div>
  )
}

export default SlackRedirect
