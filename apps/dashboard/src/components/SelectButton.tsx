export interface Props {
  isSelected?: boolean
  onClick?: (e: any) => void
  text: string
}

function SelectButton({
  isSelected,
  onClick,
  text,
}: Props) {
  return (
    <button
      className={`
        py-1
        w-[125px]
        flex
        items-center
        justify-center
        text-center
        text-sm
        font-medium
        ${isSelected ? 'text-slate-500' : 'text-slate-400'}
        ${isSelected ? 'bg-slate-200/80' : ''}
        hover:text-slate-500
        hover:bg-slate-200/80
        rounded
        transition-all
        cursor-pointer
      `}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default SelectButton