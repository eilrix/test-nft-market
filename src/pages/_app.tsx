import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import Header from '../components/header/Header';
import Layout from '../components/layout/Layout';
import { WalletProvider } from '../contexts/WalletContext';

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <WalletProvider>
      <ToastContainer />
      <Layout>
        <Header />
        <Component {...pageProps} />
      </Layout>
    </WalletProvider>
  </>
}

export default MyApp
