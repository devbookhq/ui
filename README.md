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

#### `SessionProvider`
Some components in this package needs access to Devbook session to work. You have to have `SessionProvider` somewhere as their parent.

```tsx
import { SessionProvider } from '@devbookhq/react'

export default (
  <SessionProvider opts={{ codeSnippetID: '<CODE_SNIPPET_ID>' }}>
    <...>
  </SessionProvider>
)
```

You can then access the provided session with the `useProvidedSession` hook.


#### `Casing`, `withCasing`
If you want the component to have definite round borders wrap it with the `withCasing` HOC.

```tsx
import { AnyComponent, withCasing } from '@devbookhq/react'

const ComponentWithDefiniteBorders = withCasing(AnyComponent)

<ComponentWithDefiniteBorders
  //...
/>
```


### Components
Available components:

- [CodeSnippet](#codesnippet)
- [CodeEditor](#codeeditor)
- [Terminal](#terminal)

#### `CodeSnippet`

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

#### `CodeEditor`

```tsx
import { CodeEditor, SessionProvider } from '@devbookhq/react'

export default (
  <SessionProvider opts={{ codeSnippetID: '<CODE_SNIPPET_ID>' }}>
    <CodeEditor
      autofocus={true}
      filename={} // Filename for the language service
      height={}
      isReadOnly={false}
      languageServer={ls} // Language server (from the `useLanguageServer` hook)
      onContentChange={(c) => {}} // Listen to changes
      ref={ref} // Control the editor from the parent component
      content={c} // Initial content
      language={} // Language for highlighting
    />
  </SessionProvider>
)
```

#### `Terminal`

```tsx
import { Terminal, SessionProvider } from '@devbookhq/react'

export default (
  <SessionProvider opts={{ codeSnippetID: '<CODE_SNIPPET_ID>' }}>
    <Terminal
      onStart={(handler) => {}} // Runs when the terminal starts and allows you to use `handler` to control the terminal
      ref={ref} // Use `useRef` to get reference that exposes functions to control the terminal from the parent component
      autofocus={true}
      onRunningCmdChange={(state) => {}} // Listen to changes in the executed command state
    />
  </SessionProvider>
)
```

### Hooks
If you need to create your own components these hooks will help you to use Devbook with them.

Available hooks:

- [useLanguageServer](#uselanguageserver)
- [useRunCode](#useruncode)
- [useSession](#usesession)
- [useTerminal](#useterminal)
- [usePublishedCodeSnippet](#usepublishedcodesnippet)

### Helpers
If you need to create your own components these helpers will help you to use Devbook with them.

Available helpers:

- [createSessionProcess](#createsessionprocess)
- [createTerminalProcess](#createterminalprocess)
- [languageService](#languageservice)
- [LanguageServer](#languageserver)
