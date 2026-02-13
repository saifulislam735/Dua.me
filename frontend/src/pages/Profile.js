import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import ShareLink from '../components/ShareLink';
import { apiWithAuth } from '../utils/api';

export default function Profile({ token }) {
  const [me, setMe] = useState(null);

  useEffect(() => {
    apiWithAuth('/auth/me', token).then(setMe);
  }, [token]);

  if (!me) return <Typography>Loading profile...</Typography>;
  return (
    <>
      <Typography variant="h5">@{me.username}</Typography>
      <ShareLink username={me.username} />
    </>
  );
}
