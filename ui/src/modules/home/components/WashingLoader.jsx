import React from 'react';
import Modal from '@mui/material/Modal';

import Loader from 'common/components/Loader';

const WashingLoader = ({ open }) => (
  <Modal open={open}>
    <Loader text="Зачекайте, будь ласка! Налив промивається." />
  </Modal>
);

export default WashingLoader;
