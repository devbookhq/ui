# Devbook React
Devbook library for React.

## Installation
```sh
npm install @devbookhq/react
```

## Usage
Available components:
- [CodeSnippet](#codesnippet)

### `CodeSnippet`

```tsx
import { CodeSnippet } from '@devbookhq/react'

export default <CodeSnippet
  isEditable={true}
  fallbackContent={'console.log(5)'}
  fallbackLanguage={'Typescript'}
  id={'<CODE_SNIPPET_ID>'}
  connectIDs={['<PREPENDED_CODE_SNIPPET_ID>']}
/>
```
