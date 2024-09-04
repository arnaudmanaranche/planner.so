import { Button } from '@/components/Button/Button'
import type { Journey } from '@/types'
import { formatDate } from '@/utils/date'
import { hasJourneyPassed } from '@/utils/has-journey-passed'
import router from 'next/router'

export interface MyJourneysProps {
  journeys: Journey[]
  isLoading: boolean
}

export default function MyJourneys({ journeys, isLoading }: MyJourneysProps) {
  if (isLoading) {
    return (
      <div className="mx-auto mt-20 flex min-h-[500px] max-w-screen-sm flex-col space-y-4">
        <div className="h-[100px] w-full animate-pulse rounded-lg bg-slate-200" />
        <div className="h-[100px] w-full animate-pulse rounded-lg bg-slate-200" />
        <div className="h-[100px] w-full animate-pulse rounded-lg bg-slate-200" />
      </div>
    )
  }

  return journeys.length === 0 ? (
    <div className="flex flex-1 flex-col items-center justify-center space-y-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="128"
        height="128"
        viewBox="0 0 24 24"
      >
        <g fill="#edeff3" fill-rule="evenodd">
          <path d="M8.64.439a1.75 1.75 0 0 0-1.305.03L1.311 3.05A1.75 1.75 0 0 0 .25 4.659v16.824a1.75 1.75 0 0 0 2.44 1.609l5.236-2.245a.25.25 0 0 1 .187-.004l7.248 2.718c.422.158.889.148 1.304-.03l6.024-2.582a1.75 1.75 0 0 0 1.061-1.609V2.516A1.75 1.75 0 0 0 21.31.908l-1.93.827a.25.25 0 0 1-.091.02l-6.614.177a.25.25 0 0 1-.094-.015L8.639.439Z" />
          <path
            fill="#e2e4e7"
            d="M16 11.25a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-1.5 0V12a.75.75 0 0 1 .75-.75Z"
          />
          <path
            fill="#E57C59"
            d="M15.424 12.48 16 12l-.576.48a.75.75 0 0 0 1.152 0L16 12l.576.48.004-.004.009-.011.035-.043.131-.16A38.374 38.374 0 0 0 18.62 9.75c.51-.752 1.031-1.59 1.427-2.392.384-.777.703-1.623.703-2.358a4.75 4.75 0 1 0-9.5 0c0 .735.319 1.58.703 2.358.396.803.917 1.64 1.426 2.392a38.374 38.374 0 0 0 1.997 2.672l.035.043.01.011.002.003v.001h.001Z"
          />
          <path
            fill="#FAFAFA"
            d="M16 3.25a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Z"
          />
          <path
            fill="#e2e4e7"
            d="M8 .75a.75.75 0 0 1 .75.75V20a.75.75 0 0 1-1.5 0V1.5A.75.75 0 0 1 8 .75Z"
          />
        </g>
      </svg>
      <div className="space-y-2">
        <p className="text-center text-xl font-bold text-black">
          When if not <span className="font-thin italic">today</span> ?
        </p>
        <p className="text-center text-lg text-black/70">
          It&apos;s time to start a new adventure !
        </p>
      </div>
      <Button onClick={() => router.push('/onboarding')}>
        Plan a new trip
      </Button>
    </div>
  ) : (
    <div className="flex flex-col space-y-4">
      {journeys.map((journey) => (
        <div
          key={journey.id}
          className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0"
        >
          <div className="flex flex-col space-y-1">
            <span>Destination: {journey.destination}</span>
            <span>
              Dates: {formatDate(journey.departureDate, 'dd/MM/yyyy')} -{' '}
              {formatDate(journey.returnDate, 'dd/MM/yyyy')}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => router.push(`/journey/${journey.id}`)}>
              {hasJourneyPassed(new Date(journey.departureDate))
                ? 'Visit'
                : 'Edit'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
