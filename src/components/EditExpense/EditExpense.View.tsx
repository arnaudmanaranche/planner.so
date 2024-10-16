import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { getUserFavoriteCategories } from '@/api/calls/users'
import { useDeleteExpense } from '@/api/hooks/deleteExpense'
import { useUpdateExpense } from '@/api/hooks/updateExpense'
import { QUERY_KEYS } from '@/api/queryKeys'
import type { AddExpenseWithCategories, Day } from '@/types'
import { formatDate } from '@/utils/date'

import { Button } from '../Button/Button'
import { Input } from '../Input/Input'

interface EditExpenseViewProps {
  expense: AddExpenseWithCategories
  setOpen: (open: boolean) => void
  days: Day[]
}

export const EditExpenseView = ({
  expense,
  setOpen,
  days,
}: EditExpenseViewProps): ReactNode => {
  const [newExpense, setNewExpense] =
    useState<AddExpenseWithCategories>(expense)
  const [isOnSeveralDays, setOnSeveralDays] = useState(
    newExpense.endDate ? true : false
  )
  const { handleUpdateExpense, isPending: isPendingUpdate } = useUpdateExpense({
    onSuccessCallback: () => {
      setOpen(false)
    },
  })
  const { handleDeleteExpense, isPending: isPendingDelete } = useDeleteExpense({
    onSuccessCallback: () => {
      setOpen(false)
    },
  })
  const { data: categories } = useQuery({
    queryKey: QUERY_KEYS.USER_FAVORITE_CATEGORIES(),
    queryFn: () => getUserFavoriteCategories(),
  })
  const router = useRouter()

  return (
    <div className="flex flex-col space-y-6">
      <Input
        label={<FormattedMessage id="name" defaultMessage="Name" />}
        id="expense-name"
        value={newExpense.name}
        onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
      />
      <Input
        label={<FormattedMessage id="amount" defaultMessage="Amount" />}
        id="expense-amount"
        type="number"
        value={newExpense.amount}
        onChange={(e) =>
          setNewExpense({ ...newExpense, amount: parseInt(e.target.value) })
        }
      />
      <div className="flex items-center space-x-3">
        <label htmlFor="expense-several-days" className="text-sm text-accent">
          <FormattedMessage id="severalDays" defaultMessage="Several days" />
        </label>
        <input
          type="checkbox"
          id="expense-several-days"
          checked={isOnSeveralDays}
          onChange={(e) => setOnSeveralDays(e.target.checked)}
        />
      </div>
      <div className="flex space-x-3">
        <div className="flex flex-grow flex-col space-y-1">
          <label
            htmlFor="expense-startDate"
            className="px-4 text-xs text-accent"
          >
            {isOnSeveralDays ? (
              <FormattedMessage id="startDate" defaultMessage="Start date" />
            ) : (
              <FormattedMessage id="date" defaultMessage="Date" />
            )}
          </label>
          <select
            id="expense-startDate"
            className="rounded-md border-2 border-gray-100 bg-slate-50 px-4 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
            onChange={(e) => {
              const selectedDay = JSON.parse(e.target.value)
              setNewExpense((prev) => ({
                ...prev,
                dayId: selectedDay.id,
                startDate: selectedDay.startDate,
              }))
            }}
            defaultValue={JSON.stringify({
              id: newExpense.dayId,
              startDate: newExpense.startDate,
            })}
          >
            <option disabled value="Select a day">
              <FormattedMessage id="selectDay" defaultMessage="Select a day" />
            </option>
            {days
              .sort((a, b) => a.startDate.localeCompare(b.startDate))
              .map((day) => (
                <option
                  key={new Date(day.startDate).toString()}
                  value={JSON.stringify({
                    id: day.id,
                    startDate: day.startDate,
                  })}
                >
                  {formatDate(
                    day.startDate,
                    'EEEE - dd MMMM yyyy',
                    true,
                    router.locale
                  )}
                </option>
              ))}
          </select>
        </div>
        {isOnSeveralDays ? (
          <div className="flex flex-grow flex-col space-y-1">
            <label
              htmlFor="expense-endDate"
              className="px-4 text-xs text-accent"
            >
              <FormattedMessage id="endDate" defaultMessage="End date" />
            </label>
            <select
              id="expense-endDate"
              className="rounded-md border-2 border-gray-100 bg-slate-50 px-4 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
              onChange={(e) => {
                const selectedDay = JSON.parse(e.target.value)
                setNewExpense((prev) => ({
                  ...prev,
                  dayId: selectedDay.id,
                  endDate: selectedDay.endDate,
                }))
              }}
              defaultValue={JSON.stringify({
                id: newExpense.dayId,
                endDate: newExpense.endDate,
              })}
            >
              <option disabled value="Select a day">
                <FormattedMessage
                  id="selectDay"
                  defaultMessage="Select a day"
                />
              </option>
              {days
                .sort((a, b) => a.startDate.localeCompare(b.startDate))
                .map((day) => (
                  <option
                    key={new Date(day.startDate).toString()}
                    value={JSON.stringify({
                      id: day.id,
                      endDate: day.startDate,
                    })}
                  >
                    {formatDate(
                      day.startDate,
                      'EEEE - dd MMMM yyyy',
                      true,
                      router.locale
                    )}
                  </option>
                ))}
            </select>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="expense-category" className="px-4 text-xs text-accent">
          <FormattedMessage id="categories" defaultMessage="Categories" />
        </label>
        <select
          id="expense-category"
          className="rounded-md border-2 border-gray-100 bg-slate-50 px-4 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
          onChange={(e) => {
            setNewExpense({
              ...newExpense,
              category_id: e.target.value,
            })
          }}
          defaultValue={newExpense.categories.id}
        >
          {categories?.map((category) => {
            return (
              <option key={category.name} value={category.id}>
                {category.name}
              </option>
            )
          })}
        </select>
      </div>
      <div className="flex justify-between space-x-4">
        <Button
          onClick={() => {
            handleDeleteExpense(expense.id as string)
          }}
          variant="ghost"
          isDisabled={isPendingUpdate || isPendingDelete}
        >
          {isPendingDelete ? (
            <FormattedMessage
              id="deletingExpense"
              defaultMessage="Deleting expense..."
            />
          ) : (
            <FormattedMessage
              id="deleteExpense"
              defaultMessage="Delete expense"
            />
          )}
        </Button>
        <Button
          onClick={() => {
            handleUpdateExpense(newExpense)
          }}
          isDisabled={
            isPendingUpdate || isPendingDelete || newExpense === expense
          }
        >
          {isPendingUpdate ? (
            <FormattedMessage
              id="updatingExpense"
              defaultMessage="Updating expense..."
            />
          ) : (
            <FormattedMessage
              id="updateExpense"
              defaultMessage="Update expense"
            />
          )}
        </Button>
      </div>
    </div>
  )
}
