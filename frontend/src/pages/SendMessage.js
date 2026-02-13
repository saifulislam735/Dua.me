import React from 'react';
import { Container, Typography } from '@mui/material';
import MessageForm from '../components/MessageForm';

export default function SendMessage({ username }) {
  return (
    <Container maxWidth="sm">
      <Typography variant="h5">Send anonymous message</Typography>
      <MessageForm username={username} />
    </Container>
  );
}
