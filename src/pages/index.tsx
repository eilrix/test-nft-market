import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useCallback, useEffect, useState } from 'react';

import AssetFilter from '../components/assetFilter/AssetFilter';
import AssetList from '../components/assetList/AssetList';
import Drawer from '../components/drawer/Drawer';
import { Asset, fetchAssets, Search } from '../utils/opensea';

const Home: NextPage = () => {
  const [assets, setAssets] = useState<Asset[]>();
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('md'));

  const updateAssets = useCallback(async (search: Search) => {
    setLoading(true);
    try {
      const assets = await fetchAssets(search)
      setAssets(assets);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    updateAssets({});
  }, []);

  const filterContent = <AssetFilter loading={loading} updateAssets={updateAssets} />

  return (
    <Box >
      <Head>
        <title>NFT Market</title>
      </Head>
      {!isMobile && (
        <Box sx={{ mb: 3, mt: 2 }}>{filterContent}</Box>
      )}
      {isMobile && (
        <Button onClick={() => setFilterOpen(!filterOpen)} sx={{ my: 2, mx: 1 }} variant="outlined">Open filter</Button>
      )}

      <AssetList assets={assets} loading={loading} />
      {isMobile && <Drawer open={filterOpen} setOpen={setFilterOpen}>{filterContent}</Drawer>}
    </Box>
  )
}

export default Home;
