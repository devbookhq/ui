export interface Props {
  onOutsideModalClick: (e: any) => void
}

function InstallModal({
  onOutsideModalClick,
}: Props) {
  function onModalClick(e: any) {
    e.stopPropagation()
  }

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/40
      "
      onClick={onOutsideModalClick}
    >
      <div
        className="
          bg-white
          rounded
          fixed
          top-1/2
          left-1/2
          w-[90vw]
          max-w-[450px]
          max-h-[85vh]
          p-8
          shadow-lg
          -translate-y-1/2
          -translate-x-1/2
        "
        onClick={onModalClick}
      >
        <div className="
          flex
          flex-col
        ">
          <span>Install Tailwind</span>
          <span>Select repository</span>
          <select
            className="
              border
              rounded
              py-1
              px-1.5
            "
            value="repo1"
            onChange={() => { }}
          >
            <option value="repo1">Repo1</option>
            <option value="repo2">Repo2</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default InstallModal
