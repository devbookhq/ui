import useSharedSession from 'utils/useSharedSession'
import Title from 'components/typography/Title'
import Text from 'components/typography/Text'
import Terminal, { Handler as TerminalHandler } from 'components/Terminal'
import { Language } from 'types'
import { forwardRef } from 'react'

const depsInstructions: { [lang in Language]: string } = {
  Bash: 'To install Bash dependencies use "apk add <dependency>" in the terminal. sTo remove them use "apk remove <dependency>".',
  Go: 'To install Go dependencies use "go get <dependency>" in the terminal. To remove unused dependencies use "go mod tidy".',
  Nodejs: 'To install Node.js dependencies use "npm install <dependency>" in the terminal. To remove them use "npm uninstall <dependency>".',
  Python3: 'To install Python3 dependencies use "poetry install <dependency>" in the terminal. To remove them use "poetry remove <dependency>".',
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
        size={Text.size.S2}
        className="text-gray-800"
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
