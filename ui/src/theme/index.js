import createTheme from '@mui/material/styles/createTheme';

import palette from './palette';
import components from './overrides';
import typography from './typography';

export default createTheme({
  palette,
  typography,
  components,
});
