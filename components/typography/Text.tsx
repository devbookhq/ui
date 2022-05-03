
interface Props {
  text: string
}

function Text({
  text,
}: Props) {
  return (
    <span className="
      text-white
      text-sm
    ">
      {text}
    </span>
  )
}

export default Text
