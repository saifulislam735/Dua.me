import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

export default function Signup({ onSubmit }) {
  const [username, setUsername] = useState('');

  return (
    <>
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Button onClick={() => onSubmit(username)}>Create profile</Button>
    </>
  );
}
