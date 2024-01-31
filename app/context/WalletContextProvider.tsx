"use client"    
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { UnsafeBurnerWalletAdapter,PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
// import type { AppProps } from 'next/app';
// import type { FC } from 'react';
import React, { useMemo, ReactNode } from 'react';
// Use require instead of import since order matters
require('@solana/wallet-adapter-react-ui/styles.css');
require('../app/globals.css');

const WalletConnectionProvider = ({children}:{children:ReactNode}) => {
    const endpoint = useMemo(() => 'https://api.devnet.solana.com', []);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new UnsafeBurnerWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletConnectionProvider;