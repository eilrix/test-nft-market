import { Box } from '@mui/material';
import React from 'react';

export default function Layout(props: React.PropsWithChildren<{}>) {
  return (
    <Box sx={{
      '*': { fontFamily: '"Roboto","Helvetica","Arial",sans-serif' },
      backgroundColor: '#eee', minHeight: '100vh',
    }}>
      <Box sx={{ maxWidth: '1200px', margin: 'auto', px: 2, }}>
        {props.children}
      </Box>
    </Box>
  )
}
