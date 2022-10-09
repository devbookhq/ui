# Devbook React

Devbook library for React.

## Installation

```sh
npm install @devbookhq/react
```

or

```sh
yarn add @devbookhq/react
```

## Usage

**You need to wrap Devbook components that use sessions in the `SessionProvider` component**

Available components:

- [CodeSnippet](#codesnippet)

### `CodeSnippet`

```tsx
import { CodeSnippet, SessionProvider } from '@devbookhq/react'

export default (
  <SessionProvider opts={{ codeSnippetID: '<CODE_SNIPPET_ID>' }}>
    <CodeSnippet
      isEditable={true}
      fallbackContent={'console.log(5)'}
      fallbackLanguage={'Typescript'}
      id={'<CODE_SNIPPET_ID>'}
      connectIDs={['<PREPENDED_CODE_SNIPPET_ID>']}
    />
  </SessionProvider>
)
```
