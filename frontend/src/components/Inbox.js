import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { api } from '../utils/api';
import { createSocket } from '../utils/socket';

export default function Inbox({ token, userId }) {
  const [messages, setMessages] = useState([]);

  async function loadInbox() {
    const data = await api('/messages/inbox', { headers: { Authorization: `Bearer ${token}` } });
    setMessages(data);
  }

  useEffect(() => {
    loadInbox();
    const socket = createSocket();
    socket.emit('inbox:subscribe', userId);
    socket.on('message:new', loadInbox);
    return () => socket.disconnect();
  }, [userId]);

  return messages.map((message) => (
    <Card key={message.id} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="body1">{message.text}</Typography>
        <Typography variant="caption">{message.template}</Typography>
      </CardContent>
    </Card>
  ));
}
