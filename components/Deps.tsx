import useSharedSession from 'utils/useSharedSession'
import Title from 'components/typography/Title'
import Text from 'components/typography/Text'
import Terminal from 'components/Terminal'
import { Language } from 'types'

const depsInstructions: { [lang in Language]: string } = {
  Bash: 'To install packages use..',
  Go: 'To install packages use..',
  Nodejs: 'To install packages use..',
  Python3: 'To install packages use..',
}

export interface Props {
  language: Language
}

function Deps({ language }: Props) {
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
        text={depsInstructions[language]}
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
