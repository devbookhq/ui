import { CodeEditor } from '@devbookhq/code-editor'
import {
  DetailedHTMLProps,
  HTMLAttributes,
} from 'react'
import { EditorView } from '@codemirror/view'
import { oneDark } from '@codemirror/theme-one-dark'
import { useCallback } from 'react'
import path from 'path-browserify'

// import { analytics } from 'utils/analytics'
import { rootdir } from '../../constants'
import CopyToClipboardButton from '../CopyToClipboardButton'
import { supportedLanguages } from 'guides/languages'

const darkEditorTheme = EditorView.theme({ '.cm-gutters': { background: '#282c34' } })

type Props<T, U extends HTMLAttributes<T> = HTMLAttributes<T>> = DetailedHTMLProps<U, T>

function Pre(p: Props<HTMLPreElement>) {
  const code = (p.children as any).props.children

  // original format is 'language-ts', we want just 'ts'.
  let lang = ''
  if ((p.children as any)?.props?.className) {
    const s = ((p.children as any).props.className as string).split('-')

    // ['language', 'ts']
    if (s.length === 2) {
      lang = s[1]
    }
  }

  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(code)
    // analytics.track('guide code block copied', { code })
  }, [code])

  const handleEditorCopy = useCallback((code: string, startLine: number) => {
    // analytics.track('guide code block selection copied', {
    //   code,
    //   startLine,
    // })
  }, [])

  if ((p.children as any).type.name === 'code') {

    return (
      <div className="
        mt-5
        mb-8
        flex
        flex-col
        rounded-lg
        border
        border-indigo-400/20
        bg-gray-800
      ">
        <div className="
          py-1
          px-3
          flex
          items-center
          self-stretch
          justify-between
        ">
          <div />
          <div className="
            flex
            items-center
            space-x-1
          ">
            <CopyToClipboardButton
              onClick={handleCopyToClipboard}
            />
          </div>
        </div>

        <div className="
          relative
          rounded-b-lg
        ">
          <CodeEditor
            className="not-prose rounded-b-lg"
            content={code}
            filename={path.join(rootdir, `dummy-name-${Math.floor(Math.random() * 1000)}.${lang}`)}
            languageClients={undefined}
            supportedLanguages={supportedLanguages}
            theme={[oneDark, darkEditorTheme]}
            onCopy={handleEditorCopy}
            isReadOnly
          />
        </div>
      </div>
    )
  }

  throw new Error('Don\'t know how to render the `pre` element')
}

export default Pre
