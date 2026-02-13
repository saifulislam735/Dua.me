import React from 'react';
import { Button, Stack, Typography } from '@mui/material';

export default function Home() {
  return (
    <Stack spacing={2}>
      <Typography variant="h3">Receive anonymous duas and guidance</Typography>
      <Typography>Share your unique link and let friends send anonymous support, advice, or motivation.</Typography>
      <Stack direction="row" spacing={1}>
        <Button variant="contained" href="/login">Login / Sign up</Button>
        <Button variant="outlined" href="/@exampleuser">Try example link</Button>
      </Stack>
    </Stack>
  );
}
