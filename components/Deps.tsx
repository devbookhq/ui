import useSharedSession from 'utils/useSharedSession'
import Title from 'components/typography/Title'
import Text from 'components/typography/Text'
import Terminal, { Handler as TerminalHandler } from 'components/Terminal'
import { Language } from 'types'
import { forwardRef, ReactNode } from 'react'


function InfoText({ text }: { text: string }) {
  return <Text className="text-gray-800" text={text} />
}

function InfoCodeText({ text }: { text: string }) {
  return <Text className="text-gray-500 bg-black-700 py-[2px] px-[4px] rounded" text={text} mono={true} />
}

const depsInstructions: { [lang in Language]: ReactNode } = {
  Bash:
    <>
      <InfoText text="To install Bash dependencies use " />
      <InfoCodeText text="apk add <dependency>" />
      <InfoText text=" in the terminal. To remove them use " />
      <InfoCodeText text="apk remove <dependency>" />
    </>,
  Go:
    <>
      <InfoText text="To install Go dependencies use " />
      <InfoCodeText text="go get <dependency>" />
      <InfoText text=" in the terminal. To remove them use " />
      <InfoCodeText text="go mod tidy" />
    </>,
  Nodejs:
    <>
      <InfoText text="To install Node.js dependencies use " />
      <InfoCodeText text="npm install <dependency>" />
      <InfoText text=" in the terminal. To remove them use " />
      <InfoCodeText text="npm uninstall <dependency>" />
    </>,
  Python3:
    <>
      <InfoText text="To install Python 3 dependencies use " />
      <InfoCodeText text="poetry install <dependency>" />
      <InfoText text=" in the terminal. To remove them use " />
      <InfoCodeText text="poetry remove <dependency" />
    </>,
}

const generalInstructions = <>
  <InfoText text="Your code is saved and executed in the " />
  <InfoCodeText text="/code" />
  <InfoText text=" directory." />
</>

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
      <div className="flex flex-col">
        <span>
          {generalInstructions}
        </span>
        <span>
          {depsInstructions[language]}
        </span>
      </div>
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
