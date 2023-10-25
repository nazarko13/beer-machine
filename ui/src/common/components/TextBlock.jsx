import React from 'react';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Marquee from 'react-fast-marquee';

const useStyles = makeStyles({
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
});

const TextBlock = ({ text = '', variant = 'body1', interactive = false }) => {
  const c = useStyles();

  if (interactive) {
    return (
      <Tooltip title={text}>
        <Grid className={c.container}>
          <Marquee speed={50}>
            <Typography variant={variant} sx={{ mr: 2, width: '100%' }}>
              {text}
            </Typography>
          </Marquee>
        </Grid>
      </Tooltip>
    );
  }

  return (
    <Grid className={c.container}>
      <Tooltip title={text}>
        <Typography variant={variant}>{text}</Typography>
      </Tooltip>
    </Grid>
  );
};

export default TextBlock;
