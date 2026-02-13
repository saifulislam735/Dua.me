import React, { useEffect, useState } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import ShareLink from '../components/ShareLink';
import { apiWithAuth } from '../utils/api';

export default function Profile({ token }) {
  const [me, setMe] = useState(null);
  const [username, setUsername] = useState('');

  const loadMe = async () => {
    const data = await apiWithAuth('/auth/me', token);
    setMe(data);
    setUsername(data.username || '');
  };

  useEffect(() => {
    loadMe();
  }, [token]);

  const saveProfile = async () => {
    try {
      const data = await apiWithAuth('/users/profile', token, { method: 'POST', body: JSON.stringify({ username }) });
      setMe(data);
      setUsername(data.username || '');
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const enablePremium = async () => {
    try {
      await apiWithAuth('/users/premium', token, { method: 'POST', body: JSON.stringify({ isPremium: true }) });
      toast.success('Premium featured profile enabled');
      loadMe();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!me) return <Typography>Loading profile...</Typography>;
  return (
    <Stack spacing={2}>
      <Typography variant="h5">@{me.username}</Typography>
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={saveProfile}>Save profile</Button>
        {!me.is_premium && <Button variant="outlined" onClick={enablePremium}>Enable featured profile</Button>}
      </Stack>
      <ShareLink username={me.username} />
    </Stack>
  );
}
