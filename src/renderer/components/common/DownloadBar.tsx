import { Box, Grid, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

interface Props {
  status: string;
  value: number;
}
export const DownloadBar = ({ status, value }: Props) => {
  return (
    <Grid container direction="row" spacing={2} pl={4}>
      <div className="downloadBar">
        {/* <CircularProgress variant="determinate" value={10} /> */}
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress variant="determinate" value={value} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
            >{`${value}%`}</Typography>
          </Box>
        </Box>
        <Grid xs={4}>{status}</Grid>
      </div>
    </Grid>
  );
};

export default DownloadBar;
