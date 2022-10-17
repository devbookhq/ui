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
        enabled ? 'bg-green-500' : 'bg-green-200'
      } relative inline-flex h-6 w-11 items-center rounded-full`}
      onChange={onChange}
    >
      <span className="sr-only">Enable notifications</span>
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white-900 transition`}
      />
    </Switch>
  )
}

export default Toggle
