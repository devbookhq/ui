import { forwardRef, ReactNode } from 'react'
import cn from 'classnames'

import useSharedSession from 'utils/useSharedSession'
import Title from 'components/typography/Title'
import Text from 'components/typography/Text'
import Terminal, { Handler as TerminalHandler } from 'components/Terminal'
import { Language } from 'types'
import InfoCodeText from './InfoCodeText'

function InfoText({ text }: { text: string }) {
  return <Text className="text-gray-800" text={text} size={Text.size.S1} />
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
      <InfoText text="." />
    </>,
  Go:
    <>
      <InfoText text="To install Go dependencies use " />
      <InfoCodeText text="go get <dependency>" clipboard={true} />
      <InfoText text=" in the terminal." />
      <br />
      <InfoText text="To remove them use " />
      <InfoCodeText text="go mod tidy" clipboard={true} />
      <InfoText text="." />
    </>,
  Nodejs:
    <>
      <InfoText text="To install Node.js dependencies use " />
      <InfoCodeText text="npm install <dependency>" clipboard={true} />
      <InfoText text=" in the terminal." />
      <br />
      <InfoText text="To remove them use " />
      <InfoCodeText text="npm uninstall <dependency>" clipboard={true} />
      <InfoText text="." />
    </>,
  Typescript:
    <>
      <InfoText text="To install Typescript dependencies use " />
      <InfoCodeText text="npm install <dependency>" clipboard={true} />
      <InfoText text=" in the terminal." />
      <br />
      <InfoText text="To remove them use " />
      <InfoCodeText text="npm uninstall <dependency>" clipboard={true} />
      <InfoText text="." />
    </>,
  Python3:
    <>
      <InfoText text="To install Python 3 dependencies use " />
      <InfoCodeText text="poetry add <dependency>" clipboard={true} />
      <InfoText text=" in the terminal." />
      <br />
      <InfoText text="To remove them use " />
      <InfoCodeText text="poetry remove <dependency>" clipboard={true} />
      <InfoText text="." />
    </>,
  Rust:
    <>
      <InfoText text="MISSING" />
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
    ">
      <Title
        title="Customize dependencies"
        size={Title.size.T2}
      />
      <div className="
        mt-1
        mb-4
        flex
        flex-col
        items-start
      ">
        <div>
          {generalInstructions}
        </div>
        <div>
          {depsInstructions[language]}
        </div>
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
