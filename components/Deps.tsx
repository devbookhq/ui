import useSharedSession from 'utils/useSharedSession'
import Title from 'components/typography/Title'
import Text from 'components/typography/Text'
import Terminal, { Handler as TerminalHandler } from 'components/Terminal'
import { Language } from 'types'
import { forwardRef } from 'react'

const depsInstructions: { [lang in Language]: string } = {
  Bash: 'To install Bash dependencies use "apk add <dependency>". To remove them use "apk remove <dependency>".',
  Go: 'To install Go packages use..',
  Nodejs: 'To install packages use..',
  Python3: 'To install packages use..',
}

export interface Props {
  language: Language
  initialized?: boolean
}

const Deps = forwardRef<TerminalHandler, Props>(({ language, initialized }, ref) => {
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
        ref={ref}
        height="450px"
        autofocus={true}
        terminalManager={initialized ? session.terminalManager : undefined}
      />
    </div>
  )
})

Deps.displayName = 'Deps'

export default Deps
