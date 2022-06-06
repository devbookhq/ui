// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { createIsland } from 'preact-island'

import Embed from './Embed'

const id = String.raw`<<DBK_CODE_SNIPPET_ID>>`
const title = String.raw`<<DBK_CODE_SNIPPET_CODE>>`
const code = String.raw`<<DBK_CODE_SNIPPET_TITLE>>`

const embed = createIsland(Embed)

embed.render({
  initialProps: {
    code,
    title,
    id,
  },
  inline: true,
})
