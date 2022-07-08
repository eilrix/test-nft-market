import { Box, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Image from 'next/image';
import React from 'react';

import { Asset } from '../../utils/openseaClient';

export default function AssetList({ assets, loading }: {
  assets?: Asset[];
  loading: boolean;
}) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {assets?.map(asset => (
        <Box key={asset.link} sx={{
          width: {
            xs: '50%',
            sm: '33%',
            md: '25%',
            lg: '20%',
          },
          px: 1,
          mb: 3,
        }}>
          <Box sx={{
            bgcolor: 'background.paper',
            borderRadius: '10px',
            overflow: 'hidden',
            ':hover': {
              boxShadow: '0 0 7px 0 rgb(0 0 0 / 8%)',
            }
          }}>
            <Box sx={{ height: '200px', cursor: 'pointer', position: 'relative' }}
              onClick={() => window.open(asset.link, '_blank')}>
              {loading ? (
                <Skeleton variant="rectangular" height="100%" width='100%' />
              ) : asset.image && (
                <Image src={asset.image} alt={asset.title}
                  width='100%' height="200px" layout="fill"
                  loader={() => asset.image || ''}
                  style={{ borderRadius: '10px 10px 0 0' }} />
              )}
            </Box>
            <Box sx={{ p: 2, minHeight: '100px' }}>
              <Typography fontWeight={500} fontSize={'1em'} sx={{
                cursor: 'pointer',
                maxHeight: '50px',
                overflow: 'hidden',
              }}
                onClick={() => window.open(asset.link, '_blank')}
              >{asset.title}</Typography>
              <Typography fontSize={'0.7em'}>{asset.author}</Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}