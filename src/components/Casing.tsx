import React, { ComponentType, PropsWithChildren } from 'react'

function Casing({ children }: PropsWithChildren<unknown>) {
  return (
    <div
      className="
    flex
    flex-1
    flex-col
    overflow-hidden
    rounded-lg
    border
    border-black-700
    bg-black-850
    pb-1
  "
    >
      {children}
    </div>
  )
}

export function withCasing<P extends object>(Component: ComponentType<P>) {
  const Cased = (props: P) => {
    return (
      <Casing>
        <Component {...props} />
      </Casing>
    )
  }

  Cased.displayName = Component.displayName

  return Cased
}

export default Casing
