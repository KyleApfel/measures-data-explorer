import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { Provider } from "mobx-react";
import { useStore } from '../store/measure_data.store'

function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialState)

  return (
    <>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default MyApp
