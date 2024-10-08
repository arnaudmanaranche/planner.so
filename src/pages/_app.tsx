import '@/styles/globals.css'

import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import { Open_Sans, Playfair_Display } from 'next/font/google'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { IntlProvider } from 'react-intl'
import { Toaster } from 'sonner'

import enMessages from '../../assets/translations/en.json'
import frMessages from '../../assets/translations/fr.json'

const messages = {
  en: enMessages,
  fr: frMessages,
}

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair',
  display: 'optional',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-open-sans',
  display: 'optional',
})

export default function App({ Component, pageProps }: AppProps): ReactNode {
  const router = useRouter()
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      })
  )

  const currentLocale = useMemo(() => router.locale ?? 'en', [router.locale])

  return (
    <>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/meta-image.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content="/meta-image.png" />
      </Head>
      <IntlProvider
        messages={messages[currentLocale as 'en' | 'fr']}
        locale={currentLocale}
        defaultLocale={router.defaultLocale}
      >
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={pageProps.dehydratedState}>
            <Toaster richColors visibleToasts={1} />
            <div className={`${playfair.variable} ${openSans.variable}`}>
              <Component {...pageProps} />
            </div>
            <Analytics />
          </HydrationBoundary>
          <ReactQueryDevtools buttonPosition="top-right" />
        </QueryClientProvider>
      </IntlProvider>
    </>
  )
}
