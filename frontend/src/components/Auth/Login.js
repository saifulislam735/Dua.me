import React, { useState } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';

export default function Login({ onToken }) {
  const [email, setEmail] = useState('');
  const [magicToken, setMagicToken] = useState('');

  const requestLink = async () => {
    const data = await api('/auth/email/magic-link', { method: 'POST', body: JSON.stringify({ email }) });
    toast.info(`Magic link generated (dev): ${data.magicLink}`);
  };

  const verifyLink = async () => {
    const data = await api(`/auth/magic/verify?token=${encodeURIComponent(magicToken)}`);
    localStorage.setItem('token', data.token);
    onToken(data.token);
    toast.success('Logged in');
  };

  return (
    <Stack spacing={2} maxWidth={420}>
      <Typography variant="h5">Login</Typography>
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button variant="contained" onClick={requestLink}>Send magic link</Button>
      <TextField label="Paste token from magic link" value={magicToken} onChange={(e) => setMagicToken(e.target.value)} />
      <Button variant="outlined" onClick={verifyLink}>Verify token</Button>
      <Button href={`${process.env.REACT_APP_API_BASE || 'http://localhost:4000'}/auth/google`}>Sign in with Google</Button>
    </Stack>
  );
}
