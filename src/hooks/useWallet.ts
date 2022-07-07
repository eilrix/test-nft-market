import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';

import { Wallet, WalletContext, WalletState } from '../contexts/WalletContext';

/**
 * Used anywhere in the app to retrieve wallet state
 */
export function useWallet(): WalletState {
    return useContext(WalletContext);
}

const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;

/**
 * Used in app root component
 */
export function useWalletApp(): WalletState {
    const isLoadingRef = useRef(false);
    const isUpdatingAccountsRef = useRef(false);
    const web3Ref = useRef<Web3 | undefined>();
    const web3ModalRef = useRef<Web3Modal | undefined>();
    const providerRef = useRef<any>();
    const [wallet, setWallet] = useState<Wallet>();
    const [failed, setFailed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [exchangeRates, setExchangeRates] = useState<Record<string, string>>();


    const connectWallet = useMemo(() => async () => {
        if (isLoadingRef.current) return;
        isLoadingRef.current = true;

        if (wallet || web3Ref.current) {
            await disconnectWallet();
        }
        setLoading(true);
        setFailed(false);

        try {
            web3ModalRef.current = new Web3Modal({
                network: "mainnet",
                cacheProvider: true,
                providerOptions: {
                    coinbasewallet: {
                        package: CoinbaseWalletSDK,
                        options: {
                            appName: "NFT Market",
                            infuraId: INFURA_ID,
                        }
                    },
                    walletconnect: {
                        display: {
                            name: "Mobile"
                        },
                        package: WalletConnectProvider,
                        options: {
                            infuraId: INFURA_ID
                        }
                    }
                },
            });
            const provider = await web3ModalRef.current.connect();
            providerRef.current = provider;

            provider.on("accountsChanged", updateAccounts);
            provider.on("chainChanged", updateAccounts);
            provider.on("networkChanged", updateAccounts);
            provider.on("close", disconnectWallet);

            await provider.enable();

            const web3 = new Web3(provider);
            web3.eth.extend({
                methods: [
                    {
                        name: "chainId",
                        call: "eth_chainId",
                        outputFormatter: web3.utils.hexToNumber as any
                    }
                ]
            });

            web3Ref.current = web3;

            await updateAccounts();

        } catch (error) {
            console.error(error)
            setFailed(true);
        }

        isLoadingRef.current = false;
        setLoading(false);

    }, [wallet]);


    const updateAccounts = useMemo(() => async () => {
        const web3 = web3Ref.current
        if (!web3 || isUpdatingAccountsRef.current) return;
        isUpdatingAccountsRef.current = true;

        try {
            const chainId = await web3.eth.getChainId();
            const accounts = await web3.eth.getAccounts();
            const balances = await Promise.all(accounts
                .map(account => web3.eth.getBalance(account)
                    .then(rawBallance => parseFloat(web3.utils.fromWei(rawBallance, 'ether')))));

            const totalBalance = balances.reduce(((prev, curr) => prev + curr), 0);

            setWallet({
                totalBalance,
                accounts,
                chainId,
            });

        } catch (error) {
            console.error('Failed update accounts: ', error);
        }

        isUpdatingAccountsRef.current = false;
    }, []);


    const checkExchangeRates = useMemo(() => async () => {
        if (exchangeRates) return;

        try {
            const rates = (await (await fetch('https://api.coinbase.com/v2/exchange-rates?currency=ETH'))
                .json())?.data?.rates;

            setExchangeRates(rates);
        } catch (error) {
            console.error('Failed to load exchange rates: ', error);
        }
    }, [exchangeRates]);


    const disconnectWallet = useMemo(() => async () => {
        const web3: any = web3Ref.current;
        if (!web3 || !web3ModalRef.current) return;

        if (web3.currentProvider?.close) {
            await web3.currentProvider.close();
        }
        await web3ModalRef.current.clearCachedProvider();

        setWallet(undefined);
        setLoading(false);
        setFailed(false);
    }, []);

    useEffect(() => {
        connectWallet();
        checkExchangeRates();
    }, []);


    return useMemo(() => ({
        wallet,
        failed,
        loading,
        exchangeRates,
        connectWallet,
        disconnectWallet,
        provider: providerRef.current,
        web3: web3Ref.current,
    }), [wallet, failed, loading, connectWallet, exchangeRates]);
}

