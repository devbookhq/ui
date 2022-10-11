function useSelectedBlock() {}

function Inspector() {
  const selectedBlock = useSelectedBlock()

  if (!selectedBlock) return null

  return <div className="flex border-t border-black-700">INSPECTOR</div>
}

export default Inspector
