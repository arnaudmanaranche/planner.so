import { Button, ButtonProps } from '@/components/Button/Button'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

const meta = {
  title: 'Button',
  component: Button,
  argTypes: {},
  args: {
    children: 'Add a new expense',
    onClick: fn(),
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: (args) => {
    return (
      <div className="flex flex-col space-y-4">
        <div className="space-y-4">
          <p className="text-4xl font-medium">Primary</p>
          <Button {...args} />
        </div>
        <div className="space-y-4">
          <p className="text-4xl font-medium">Ghost</p>
          <Button {...args} variant="ghost" />
        </div>
        <div className="space-y-4">
          <p className="text-4xl font-medium">Disabled</p>
          <Button {...args} isDisabled />
        </div>
      </div>
    )
  },
}
