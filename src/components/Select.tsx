import * as RadixSelect from '@radix-ui/react-select'

function Select() {
  return (
    <RadixSelect.Root>
      <RadixSelect.Trigger>
        <RadixSelect.Value />
        <RadixSelect.Icon />
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content>
          <RadixSelect.ScrollUpButton />
          <RadixSelect.Viewport>
            <RadixSelect.Item value="1">
              <RadixSelect.ItemText />
              <RadixSelect.ItemIndicator />
            </RadixSelect.Item>

            <RadixSelect.Group>
              <RadixSelect.Label />
              <RadixSelect.Item value="2">
                <RadixSelect.ItemText />
                <RadixSelect.ItemIndicator />
              </RadixSelect.Item>
            </RadixSelect.Group>

            <RadixSelect.Separator />
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton />
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}

export default Select
