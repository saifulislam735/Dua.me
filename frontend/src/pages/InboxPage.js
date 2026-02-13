import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import Inbox from '../components/Inbox';
import { apiWithAuth } from '../utils/api';

export default function InboxPage({ token }) {
  const [me, setMe] = useState(null);
  useEffect(() => {
    apiWithAuth('/auth/me', token).then(setMe);
  }, [token]);
  if (!me) return <Typography>Loading inbox...</Typography>;
  return <Inbox token={token} userId={me.id} />;
}
