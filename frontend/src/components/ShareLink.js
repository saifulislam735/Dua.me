import React from 'react';
import { Button, Stack, TextField } from '@mui/material';

export default function ShareLink({ username }) {
  const url = `https://dua.me/${username}`;
  return (
    <Stack spacing={1}>
      <TextField value={url} label="Shareable link" InputProps={{ readOnly: true }} />
      <Stack direction="row" spacing={1}>
        <Button href={`https://wa.me/?text=${encodeURIComponent(url)}`}>WhatsApp</Button>
        <Button href={`https://x.com/intent/post?text=${encodeURIComponent(url)}`}>X</Button>
        <Button href={`https://www.instagram.com/`}>Instagram</Button>
      </Stack>
    </Stack>
  );
}
