import {
  ReactNode,
  Fragment,
  useState,
} from 'react'
import { Dialog, Transition } from '@headlessui/react'

import Title from 'components/typography/Title'

interface Props {
  title: string
  children: ReactNode
  isOpen: boolean
  onClose: () => void
}

function Modal({
  title,
  children,
  isOpen,
  onClose,
}: Props) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#000]/50" />
        </Transition.Child>

        <div className="
          fixed
          inset-0
          flex
          justify-center
          fixed
          inset-0
          overflow-y-auto
        ">
          <div className="
            flex-1
            flex
            min-h-full
            max-w-[800px]
            items-center
            justify-center
            p-4
            text-center
            relative
            top-[-100px]
          ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="
                flex
                flex-col
                items-start
                w-full
                max-w-full
                transform
                rounded-lg
                backdrop-blur
                bg-black-900/30
                p-6
                align-middle
                shadow-xl
                transition-all
                border
                border-black-700
                text-white-900
              ">
                <div className="
                  flex
                  items-center
                  justify-start
                ">
                  <Dialog.Title
                    as={Title}
                    title={title}
                    size={Title.size.T1}
                  />
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
