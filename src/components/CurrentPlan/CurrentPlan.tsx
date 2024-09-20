import clsx from 'clsx'
import type { ReactNode } from 'react'

export interface CurrentPlanProps {
  credits: number
  isLoading: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCheckout: (...args: any[]) => void
}

export function CurrentPlan({
  isLoading,
  onCheckout,
  credits,
}: CurrentPlanProps): ReactNode {
  return (
    <div className="flex items-center justify-between rounded-md bg-white p-4 text-black ring-1 ring-slate-200">
      <div className="flex w-full items-center justify-between">
        <div className="space-y-2 text-black">
          <p className="text-sm">Plan</p>
          <p className="text-2xl font-medium">Free</p>
        </div>
        <div className="space-y-2 text-black">
          <p className="text-sm">Credits left</p>
          <p className="text-2xl font-medium">{credits}</p>
        </div>
        <div className="space-x-3 text-sm text-black/70">
          <span
            className={clsx(
              'cursor-pointer text-accent',
              isLoading && 'cursor-not-allowed'
            )}
            onClick={onCheckout}
          >
            {isLoading ? 'Redirecting...' : 'Buy more credits'}
          </span>
        </div>
      </div>
    </div>
  )
}