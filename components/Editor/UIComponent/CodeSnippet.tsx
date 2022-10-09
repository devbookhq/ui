import { CodeSnippet as CS } from '@devbookhq/react'

export function Icon() {
  return <div>CODE</div>
}

function CodeSnippet() {
  return (
    <div className="flex">
      <CS
        fallbackContent="Content"
        id="Mh3XS5Pq9ch8"
        isEditable={true}
      />
    </div>
  )
}

export default CodeSnippet
