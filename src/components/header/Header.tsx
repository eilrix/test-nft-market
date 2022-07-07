import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { Avatar, Box, Button, CircularProgress, Divider, Tooltip, Typography } from '@mui/material';
import React from 'react';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useWallet } from '../../hooks/useWallet';


export default function Header() {
  const { wallet, loading, failed, exchangeRates, connectWallet, disconnectWallet } = useWallet();

  const usdcBalance = exchangeRates?.USDC && wallet?.totalBalance
    && parseFloat(exchangeRates?.USDC) * wallet.totalBalance;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2, alignItems: 'center' }}>
      <Box>
        <Typography fontSize={'2rem'} fontWeight={600}>NFT Market</Typography>
      </Box>
      <Box sx={{
        display: 'flex', alignItems: 'center',
        bgcolor: 'background.paper', px: 2, py: 1,
        boxShadow: '0 0 7px 0 rgb(0 0 0 / 8%)',
        borderRadius: '30px'
      }}>
        <Tooltip title={wallet ? 'Disconnect wallet' : ''}>
          <Avatar sx={{
            mr: 2, cursor: wallet && 'pointer', '&:hover': wallet && {
              '& .walletOutlinedIcon': { display: 'none' },
              '& .logoutOutlinedIcon': { display: 'block' },
            }
          }} onClick={disconnectWallet}>
            <AccountBalanceWalletOutlinedIcon className='walletOutlinedIcon' />
            <LogoutOutlinedIcon className='logoutOutlinedIcon' sx={{ display: 'none' }} />
          </Avatar>
        </Tooltip>
        {loading && (
          <CircularProgress />
        )}
        {failed && (
          <Box>
            <Typography fontSize={'0.8rem'} sx={{ mr: 1 }}>Failed to connect wallet</Typography>
          </Box>
        )}
        {!loading && !wallet && (
          <Button onClick={connectWallet}>Connect wallet</Button>
        )}
        {wallet?.totalBalance !== undefined && (
          <Box>
            {!isNaN(Number(wallet.totalBalance)) && (
              <Typography fontWeight={500}>{wallet.totalBalance < 0.001 ?
                wallet.totalBalance?.toPrecision(2) : wallet.totalBalance.toFixed(3)} ETH</Typography>
            )}
            <Divider sx={{ my: 0.3 }} />
            {!isNaN(Number(usdcBalance)) && (
              <Typography fontSize={'0.8rem'} color="#888">{usdcBalance && usdcBalance.toFixed(2)} USDC</Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}
