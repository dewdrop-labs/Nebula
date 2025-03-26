import "./globals.css";
import Providers from "./providers";
import type { AppProps } from 'next/app';


export default function App({ Component, pageProps: {...pageProps } }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}
