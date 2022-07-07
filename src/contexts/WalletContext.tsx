import React from 'react';
import { useWalletApp } from '../hooks/useWallet';

export type Wallet = {
    totalBalance?: number;
    accounts?: string[];
    chainId?: number;
}

export type WalletState = {
    wallet?: Wallet;
    loading?: boolean;
    failed?: boolean;
    provider?: any;
    web3?: any;
    exchangeRates?: Record<string, string>;
    connectWallet?: () => void;
    disconnectWallet?: () => void;
}

export const WalletContext = React.createContext<WalletState>({});

export function WalletProvider(props: { children: React.ReactNode }) {
    const wallet = useWalletApp();

    return <WalletContext.Provider value={wallet}>
        {props.children}
    </WalletContext.Provider>
}