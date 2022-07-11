import { forwardRef, ReactNode } from 'react'
import cn from 'classnames'

import useSharedSession from 'utils/useSharedSession'
import Title from 'components/typography/Title'
import Text from 'components/typography/Text'
import Terminal, { Handler as TerminalHandler } from 'components/Terminal'
import { Language } from 'types'
import CopyIcon from './icons/Copy'

function InfoText({ text }: { text: string }) {
  return <Text className="text-gray-800" text={text} />
}

function InfoCodeText({ text, clipboard }: { text: string, clipboard?: boolean }) {
  function copy() {
    if (clipboard && text) {
      const clipboardText = text.replace('<dependency>', '')
      navigator.clipboard.writeText(clipboardText)
    }
  }

  return (
    <div
      className={cn('text-gray-800 bg-black-800 border border-black-700 py-[1px] px-2 rounded items-center flex-row inline-flex', { 'hover:cursor-pointer hover:bg-black-700 space-x-2': clipboard })}
      onClick={copy}
    >
      <Text
        className="text-gray-500"
        text={text}
        mono={true}
      />
      {clipboard && <CopyIcon />}
    </div>
  )
}

const depsInstructions: { [lang in Language]: ReactNode } = {
  Bash:
    <>
      <InfoText text="To install Bash dependencies use " />
      <InfoCodeText text="apk add <dependency>" clipboard={true} />
      <InfoText text=" in the terminal." />
      <br />
      <InfoText text="To remove them use " />
      <InfoCodeText text="apk remove <dependency>" clipboard={true} />
    </>,
  Go:
    <>
      <InfoText text="To install Go dependencies use " />
      <InfoCodeText text="go get <dependency>" clipboard={true} />
      <InfoText text=" in the terminal." />
      <br />
      <InfoText text="To remove them use " />
      <InfoCodeText text="go mod tidy" clipboard={true} />
    </>,
  Nodejs:
    <>
      <InfoText text="To install Node.js dependencies use " />
      <InfoCodeText text="npm install <dependency>" clipboard={true} />
      <InfoText text=" in the terminal." />
      <br />
      <InfoText text="To remove them use " />
      <InfoCodeText text="npm uninstall <dependency>" clipboard={true} />
    </>,
  Python3:
    <>
      <InfoText text="To install Python 3 dependencies use " />
      <InfoCodeText text="poetry add <dependency>" clipboard={true} />
      <InfoText text=" in the terminal." />
      <br />
      <InfoText text="To remove them use " />
      <InfoCodeText text="poetry remove <dependency>" clipboard={true} />
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
        height="400px"
        autofocus={true}
        terminalManager={initialized ? session.terminalManager : undefined}
      />
    </div>
  )
})

Deps.displayName = 'Deps'

export default Deps
