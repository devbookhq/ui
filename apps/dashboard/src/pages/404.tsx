import Text from 'components/typography/Text'
import { XCircle } from 'lucide-react'

function Custom404() {
  return (
    <div className="flex flex-1 justify-center items-center">
      <Text text="Page Not Found" size={Text.size.S1} icon={<XCircle />} />
    </div>
  )
}

export default Custom404
