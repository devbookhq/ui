import {
  ReactNode,
  forwardRef,
} from 'react'
import Text from 'components/typography/Text'

export enum Variant {
  Full,
  Outline,
}

interface Props {
  className?: string
  text: string
  variant?: Variant
  icon?: ReactNode
  onClick?: (e: any) => void
}

const Button = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    className,
    text,
    variant = Variant.Outline,
    icon,
    onClick,
  } = props
  if (variant === Variant.Full) {
    return (
      <button
        ref={ref}
        className="
          py-1.5
          px-4

          flex
          items-center
          justify-center

          rounded-lg

          bg-green-500
          hover:shadow-lg
          hover:shadow-green-500/50
        "
        onClick={onClick}
      >
        <div className="
          flex
          flex-row
          items-center
          justify-center
          space-x-2
        ">
          {icon}
          <Text
            size={Text.size.S1}
            text={text}
          />
        </div>
      </button>
    )
  }

  return (
    <button
      ref={ref}
      className="
        p-[2px]
        rounded-lg
        bg-black-700
        hover:bg-green-gradient
        hover:shadow-lg
        hover:shadow-green-500/50
      "
      onClick={onClick}
    >
      <div className="
        py-[4px]
        px-[10px]

        flex
        flex-row
        items-center
        justify-center
        space-x-2

        rounded-lg
        bg-black-900
      ">
        {icon}
        <Text
          size={Text.size.S1}
          text={text}
        />
      </div>
    </button>
  )
});

//function Button({
//  className,
//  text,
//  variant = Variant.Outline,
//  icon,
//  onClick,
//}: Props) {
//  if (variant === Variant.Full) {
//    return (
//      <button
//        className="
//          py-1.5
//          px-4
//
//          flex
//          items-center
//          justify-center
//
//          rounded-lg
//
//          bg-green-500
//          hover:shadow-lg
//          hover:shadow-green-500/50
//        "
//        onClick={onClick}
//      >
//        <div className="
//          flex
//          flex-row
//          items-center
//          justify-center
//          space-x-2
//        ">
//          {icon}
//          <Text
//            size={Text.size.S1}
//            text={text}
//          />
//        </div>
//      </button>
//    )
//  }
//
//  return (
//    <button
//      className="
//        p-[2px]
//        rounded-lg
//        bg-black-700
//        hover:bg-green-gradient
//        hover:shadow-lg
//        hover:shadow-green-500/50
//      "
//      onClick={onClick}
//    >
//      <div className="
//        py-[4px]
//        px-[10px]
//
//        flex
//        flex-row
//        items-center
//        justify-center
//        space-x-2
//
//        rounded-lg
//        bg-black-900
//      ">
//        {icon}
//        <Text
//          size={Text.size.S1}
//          text={text}
//        />
//      </div>
//    </button>
//  )
//}

Button.variant = Variant
export default Button
