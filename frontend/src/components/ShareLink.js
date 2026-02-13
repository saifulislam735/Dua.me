import React from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

export default function ShareLink({ username }) {
  const url = `${window.location.origin}/@${username}`;
  const encoded = encodeURIComponent(url);
  return (
    <Stack spacing={1} sx={{ mt: 2 }}>
      <TextField value={url} label="Shareable link" InputProps={{ readOnly: true }} />
      <Stack direction="row" spacing={1}>
        <Button onClick={() => navigator.clipboard.writeText(url)}>Copy</Button>
        <Button href={`instagram://story-camera?source_url=${encoded}`}>Instagram</Button>
        <Button href={`twitter://post?message=${encoded}`}>X</Button>
        <Button href={`whatsapp://send?text=${encoded}`}>WhatsApp</Button>
      </Stack>
      <QRCodeSVG value={url} size={140} />
    </Stack>
  );
}
