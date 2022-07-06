import useSharedSession from 'utils/useSharedSession'
import Title from 'components/typography/Title'
import Text from 'components/typography/Text'
import Terminal from 'components/Terminal'

function Deps() {
  const session = useSharedSession()
  if (!session) throw new Error('Undefined session but it should be defined. Are you missing SessionContext in parent component?')

  return (
    <div className="
      flex-1
      flex
      w-full
      flex-col
      items-start
      space-y-4
    ">
      <Title
        title="Customize dependencies"
        size={Title.size.T2}
      />
      <Text
        text="Update ... by ..."
      />
      <Terminal
        height="450px"
        autofocus={true}
        terminalManager={session.terminalManager}
      />
    </div>
  )
}

export default Deps
