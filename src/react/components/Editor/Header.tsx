import CellHeader from '../CellHeader'
import Text from '../Text'

export interface Props {
  filepath: string
}

function Header({
  filepath,
}: Props) {

  return (
    <CellHeader>
      <div className="flex items-center space-x-2">
        <Text
          mono
          hierarchy={Text.hierarchy.Secondary}
          size={Text.size.Small}
          text={filepath}
        />
      </div>
    </CellHeader>
  )
}

export default Header
