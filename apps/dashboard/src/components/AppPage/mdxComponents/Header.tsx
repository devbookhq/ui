import Text from 'components/typography/Text'

export interface Props {
  title: string
}

function Header({ title }: Props) {
  return (
    <div
      className="px-4 py-2 bg-slate-800"
    >
      <Text
        text={title}
        size={Text.size.S2}
      />
    </div>
  )
}

export default Header
