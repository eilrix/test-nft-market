import { Box, TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import LinearProgress from '@mui/material/LinearProgress';
import React, { useCallback, useRef } from 'react';
import { debounce } from 'throttle-debounce';

import { NumberFormatCustom } from '../../utils/NumberFormat';
import { Search } from '../../utils/openseaClient';


export default function AssetFilter(props: {
  updateAssets: (search: Search) => void;
  loading: boolean;
}) {
  const { updateAssets, loading } = props;
  const search = useRef<Search>({});

  const onChangeDebounced = useCallback(debounce(300, () => {
    updateAssets(search.current);
  }), []);

  const onChange = (key: keyof Search, value: any) => {
    search.current[key] = value;
    onChangeDebounced();
  }

  return (
    <Box sx={{
      display: 'flex',
      alignItems: {
        xs: 'flex-start',
        md: 'center',
      },
      flexWrap: 'wrap',
      flexDirection: {
        xs: 'column',
        md: 'row',
      },
      bgcolor: 'background.paper',
      p: 1,
      boxShadow: {
        md: '0 0 7px 0 rgb(0 0 0 / 8%)',
      },
      borderRadius: {
        md: '30px',
      },
      position: 'relative',
      overflow: 'hidden',
    }}>
      <TextField onChange={e => onChange('search', e.target.value)} size="small" label="Search" sx={{ mx: 2, my: 1 }} />
      <Box sx={{ mx: 2, my: 1 }}>
        <TextField onChange={e => onChange('priceMin', e.target.value)}
          size="small"
          label="Min price"
          InputProps={{
            inputComponent: NumberFormatCustom as any,
          }}
          sx={{ maxWidth: '100px', mr: 2, }}
        />
        <TextField onChange={e => onChange('priceMax', e.target.value)}
          size="small"
          label="Max price"
          InputProps={{
            inputComponent: NumberFormatCustom as any,
          }}
          sx={{ maxWidth: '100px', }}
        ></TextField>
      </Box>

      <FormGroup sx={{ ml: 2, my: 1 }}>
        <FormControlLabel control={<Checkbox
          onChange={(e, checked) => onChange('buyNow', checked || undefined)}
        />} label="Buy now" />
      </FormGroup>
      <FormGroup sx={{ mx: 2, my: 1 }}>
        <FormControlLabel control={<Checkbox
          onChange={(e, checked) => onChange('newItem', checked || undefined)}
        />} label="New Item" />
      </FormGroup>

      {loading && <Box sx={{ width: '100%', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <LinearProgress />
      </Box>}
    </Box>
  )
}
