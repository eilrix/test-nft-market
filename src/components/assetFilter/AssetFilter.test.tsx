import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import AssetFilter from './AssetFilter';

describe('AccountInfo', () => {

  it("renders inputs", async () => {
    render(<AssetFilter
      loading={false}
      updateAssets={() => { }}
    />);

    await screen.findByLabelText('Search');
  });

  it("calls updateAssets", async () => {
    const onUpdateAssets = jest.fn();

    render(<AssetFilter
      loading={false}
      updateAssets={onUpdateAssets}
    />);

    const search = await screen.findByLabelText('Search');
    fireEvent.change(search, { target: { value: "test" } });

    setTimeout(() => {
      expect(onUpdateAssets).toHaveBeenCalledWith(true);
    }, 300);
  });

})