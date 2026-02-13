import React, { useEffect, useState } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

export default function Login({ onToken }) {
  const [email, setEmail] = useState('');
  const [magicToken, setMagicToken] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const token = qs.get('token');
    if (token) {
      setMagicToken(token);
    }
  }, [location.search]);

  const requestLink = async () => {
    try {
      const data = await api('/auth/email/magic-link', { method: 'POST', body: JSON.stringify({ email }) });
      toast.success('Magic link sent. Check your email.');
      if (data.magicLink) toast.info(`Dev link: ${data.magicLink}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const verifyLink = async () => {
    try {
      const data = await api(`/auth/magic/verify?token=${encodeURIComponent(magicToken)}`);
      localStorage.setItem('token', data.token);
      onToken(data.token);
      toast.success('Logged in');
      navigate('/profile');
    } catch (error) {
      toast.error(error.message);
    }
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
