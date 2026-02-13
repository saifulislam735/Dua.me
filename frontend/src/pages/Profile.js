import React from 'react';
import { Container, Typography } from '@mui/material';
import ShareLink from '../components/ShareLink';

export default function Profile({ username }) {
  return (
    <Container maxWidth="sm">
      <Typography variant="h5">Your profile</Typography>
      <ShareLink username={username} />
    </Container>
  );
}
