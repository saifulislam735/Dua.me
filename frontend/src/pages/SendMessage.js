import React from 'react';
import { Typography } from '@mui/material';
import MessageForm from '../components/MessageForm';

export default function SendMessage({ username }) {
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>Send anonymous message to @{username}</Typography>
      <MessageForm username={username} />
    </>
  );
}
