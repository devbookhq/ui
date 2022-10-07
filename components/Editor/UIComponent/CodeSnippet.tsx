import { CodeSnippet as CS, SharedSessionProvider } from '@devbookhq/react'

export function Icon() {
  return (
    <div>
      CODE
    </div>
  )
}

function CodeSnippet() {
  return (
    <div className="flex">
      <CS fallbackContent="Content" isEditable={true} id="Mh3XS5Pq9ch8" />
    </div>
  )
}

export default CodeSnippet
