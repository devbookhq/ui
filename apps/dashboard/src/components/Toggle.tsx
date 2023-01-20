import * as Switch from '@radix-ui/react-switch'

export interface Props {
  enabled: boolean
  onChange: (enabled: boolean) => any
}

function Toggle({ enabled, onChange }: Props) {
  return (
    <Switch.Root
      checked={enabled}
      className="relative h-4 w-7 rounded-full bg-slate-200 transition-all hover:bg-slate-300 radix-state-checked:bg-green-300 hover:radix-state-checked:bg-green-400"
      defaultChecked={enabled}
      onCheckedChange={onChange}
    >
      <Switch.Thumb className="block h-3 w-3 translate-x-0.5 rounded-full bg-white transition-all will-change-transform radix-state-checked:translate-x-3.5" />
    </Switch.Root>
  )
}

export default Toggle
