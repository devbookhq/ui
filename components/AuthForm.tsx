import {
  useLayoutEffect,
  useRef,
  useState,
  KeyboardEvent,
} from 'react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import cn from 'classnames'

import Text from 'components/typography/Text'
import SpinnerIcon from 'components/icons/Spinner'
import Title from 'components/typography/Title'
import Button from 'components/Button'

export enum AuthFormType {
  SignIn,
  SignUp,
}

export interface Props {
  authType: AuthFormType
}

function AuthForm({
  authType,
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [errMessage, setErrMessage] = useState('\n')

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useLayoutEffect(function autofocusEmailInput() {
    if (isLoading) return

    if (!emailRef.current?.value) {
      emailRef.current?.focus()
    } else if (!passwordRef.current?.value) {
      passwordRef.current?.focus()
    } else {
      emailRef.current?.focus()
    }
  }, [isLoading])

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') authWithEmail()
  }

  async function authWithEmail() {
    setIsLoading(true)

    const email = emailRef.current?.value
    const password = passwordRef.current?.value

    if (!email) {
      setErrMessage('Email must not be empty')
      emailRef.current?.focus()
      setIsLoading(false)
      return
    }

    if (!password) {
      passwordRef.current?.focus()
      setErrMessage('Password must not be empty')
      setIsLoading(false)
      return
    }

    const { error } = authType === AuthFormType.SignUp
      ? await supabaseClient.auth.signUp({
        email,
        password,
      })
      : await supabaseClient.auth.signIn({
        email,
        password,
      })

    if (error) {
      emailRef.current?.focus()
      setErrMessage(error.message)
    }

    setIsLoading(false)
  }

  const title = authType === AuthFormType.SignUp
    ? 'Create a new account'
    : 'Sign in'

  const buttonLabel = authType === AuthFormType.SignUp
    ? 'Sign up'
    : 'Sign in'

  const passwordAutocomplete = authType === AuthFormType.SignUp
    ? 'new-password'
    : 'current-password'

  return (
    <div className="
        py-12
        px-4
        w-[450px]
        flex
        flex-1
        flex-col
        space-y-8
        self-start
        rounded
        bg-black-800
      ">
      <Title
        title={title}
        size={Title.size.T1}
      />
      <div className="flex flex-col px-16 space-y-8">
        <div className="flex flex-col space-y-2 min-w-0">
          <input
            ref={emailRef}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className={cn(
              'px-2.5',
              'py-2',
              'rounded-lg',
              'border',
              'border-black-700',
              { 'bg-black-900': !isLoading },
              { 'bg-black-800': isLoading },
              'outline-none',
              'focus:border-green-200',
              'text-sm',
              'font-semibold',
              'placeholder:text-gray-600',
            )}
            name="email"
            autoComplete="username email"
            placeholder="Email"
            type="text"
          />
          <input
            disabled={isLoading}
            ref={passwordRef}
            onKeyDown={handleKeyDown}
            className={cn(
              'px-2.5',
              'py-2',
              'rounded-lg',
              'border',
              'flex',
              'min-w-0',
              'flex-1',
              'border-black-700',
              { 'bg-black-900': !isLoading },
              { 'bg-black-800': isLoading },
              'outline-none',
              'focus:border-green-200',
              'text-sm',
              'font-semibold',
              'placeholder:text-gray-600',
            )}
            name="password"
            type="password"
            autoComplete={passwordAutocomplete}
            placeholder="Password"
          />
        </div>
        <div className="flex flex-col space-y-4 flex-shrink-0">
          <Button
            isDisabled={isLoading}
            className="self-center"
            text={buttonLabel}
            onClick={authWithEmail}
            variant={Button.variant.Full}
          />
          {!isLoading && <Text
            text={errMessage}
            size={Text.size.S2}
            className="text-red-400 self-center"
          />
          }
          {isLoading &&
            <div className="
              flex-1
              flex
              items-center
              justify-center
            ">
              <SpinnerIcon />
            </div>
          }
        </div>
      </div>
    </div>
  )
}

AuthForm.type = AuthFormType

export default AuthForm
