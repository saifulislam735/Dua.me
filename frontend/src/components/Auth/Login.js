import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { api } from '../../utils/api';

export default function Login({ onToken }) {
  const [email, setEmail] = useState('');

  async function login() {
    const data = await api('/auth/email', { method: 'POST', body: JSON.stringify({ email }) });
    onToken(data.token);
  }

  return (
    <>
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button onClick={login}>Login</Button>
    </>
  );
}
