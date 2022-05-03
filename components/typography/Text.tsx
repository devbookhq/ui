
interface Props {
  text: string
}

function Text({
  text,
}: Props) {
  return (
    <span className="
      text-white
      text-base
    ">
      {text}
    </span>
  )
}

export default Text
