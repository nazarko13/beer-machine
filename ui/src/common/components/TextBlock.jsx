import React from 'react';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Marquee from 'react-fast-marquee';

const useStyles = makeStyles({
  container: {
    overflow: 'hidden',
    height: '100%',
    width: '100%',
  },
  runningInner: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  runningText: {
    margin: '0',
    padding: '10px 15px',
    minWidth: '100%',
    whiteSpace: 'nowrap',
    flexShrink: '0',
    animation: `$runningLine 5000ms ease infinite`,
  },

  '@keyframes runningLine': {
    from: {
      transform: 'translateX(0)',
    },

    to: {
      transform: 'translateX(-100%)',
    },
  },
});

const TextBlock = ({ text = '', variant = 'body1', interactive = false }) => {
  const c = useStyles();

  if (interactive) {
    return (
      <Tooltip title={text}>
        <Grid className={c.runningInner}>
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
    <Grid className={c.runningInner}>
      <Tooltip title={text}>
        <Typography variant={variant}>{text}</Typography>
      </Tooltip>
    </Grid>
  );
};

export default TextBlock;
