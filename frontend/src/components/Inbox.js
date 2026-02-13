import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { apiWithAuth } from '../utils/api';
import { createSocket } from '../utils/socket';
import ReportButton from './ReportButton';

export default function Inbox({ token, userId }) {
  const [messages, setMessages] = useState([]);
  const [replyByMessage, setReplyByMessage] = useState({});

  const loadInbox = async () => {
    const data = await apiWithAuth('/messages/inbox', token);
    setMessages(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
  };

  useEffect(() => {
    loadInbox();
    const socket = createSocket();
    socket.emit('inbox:subscribe', userId);
    socket.on('newMessage', loadInbox);
    return () => socket.disconnect();
  }, [userId]);

  const sendReply = async (id) => {
    try {
      await apiWithAuth(`/messages/reply/${id}`, token, { method: 'POST', body: JSON.stringify({ reply: replyByMessage[id] || '' }) });
      toast.success('Reply sent');
      await loadInbox();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Stack spacing={2}>
      {messages.map((message) => (
        <Card key={message.id}>
          <CardContent>
            <Typography variant="body1">{message.text}</Typography>
            <Typography variant="caption">{message.template} • {new Date(message.created_at).toLocaleString()}</Typography>
            {message.reply && <Typography sx={{ mt: 1 }}>Your reply: {message.reply}</Typography>}
            <TextField
              sx={{ mt: 1 }}
              size="small"
              fullWidth
              label="Reply"
              value={replyByMessage[message.id] || ''}
              onChange={(e) => setReplyByMessage((s) => ({ ...s, [message.id]: e.target.value }))}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button variant="outlined" onClick={() => sendReply(message.id)}>Reply</Button>
              <ReportButton token={token} messageId={message.id} />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
