import { Switch } from '@headlessui/react'

export interface Props {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

function Toggle({ enabled, onChange }: Props) {
  return (
    <Switch
      checked={enabled}
      className={`${
        enabled ? 'bg-yellow-200' : 'bg-gray-300'
      } relative inline-flex h-6 w-11 items-center rounded-full`}
      onChange={onChange}
    >
      <span className="sr-only">Enable notifications</span>
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 rounded-full bg-white transition`}
      />
    </Switch>
  )
}

export default Toggle
