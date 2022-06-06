import {
  useEffect,
  useState,
} from 'react'
import Title from 'components/typography/Title'
import Button from 'components/Button'

function Deps() {
  // TODO: List of existing deps.

  const [newDep, setNewDep] = useState('')
  const [deps, setDeps] = useState<string[]>([])





  function handleKeyDown(e: any) {
    if (e.key !== 'Enter') return
    // TODO: Install dep
  }


  return (
    <div className="
      flex-1
      flex
      flex-col
      items-start
      space-y-4
    ">
      <Title
        title="Install NPM packages for your code snippet"
        size={Title.size.T2}
      />

      <div className="
        w-full
        flex
        flex-col
        items-start
        space-y-4
      ">
        <div className="
          w-full
          flex
          flex-row
          space-x-4
        ">
          <input
            className="
              flex-1
              bg-transparent
              border-b
              border-black-700
              font-mono
              outline-none
              active:border-green-200
              focus:border-green-200
            "
            value={newDep}
            onChange={e => setNewDep(e.target.value)}
            placeholder="package, package@v4.2.0, @scope/package"
            onKeyDown={handleKeyDown}
          />
          <Button
            text="Install"
          />
        </div>
      </div>
    </div>
  )
}

export default Deps
