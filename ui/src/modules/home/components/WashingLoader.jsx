import React from 'react';
import Dialog from '@mui/material/Dialog';

import Loader from 'common/components/Loader';

const WashingLoader = ({ open }) => (
  <Dialog open={open}>
    <Loader withoutLogo text="Зачекайте, будь ласка! Налив промивається." />
  </Dialog>
);

export default WashingLoader;
