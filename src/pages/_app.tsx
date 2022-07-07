import '../styles/globals.css';
import { AppProps } from 'next/app';

import Header from '../components/header/Header';
import Layout from '../components/layout/Layout';
import { WalletProvider } from '../contexts/WalletContext';

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <WalletProvider>
      <Layout>
        <Header />
        <Component {...pageProps} />
      </Layout>
    </WalletProvider>
  </>
}

export default MyApp
