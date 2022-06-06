// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { render, h } from 'preact'
import Embed from './Embed'

const code = 'console.log("4")'
const codeSnippetID = 'idr-1d'

render(
  <Embed
    code={code}
    codeSnippetID={codeSnippetID}
  />,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('app')!,
)
