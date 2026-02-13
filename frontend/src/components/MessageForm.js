import React, { useState } from 'react';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { api } from '../utils/api';

const templates = ['Dua for health', 'Guidance on career', 'Dua for success', 'General motivation'];

export default function MessageForm({ username }) {
  const [template, setTemplate] = useState(templates[0]);
  const [text, setText] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await api(`/messages/send/${username}`, { method: 'POST', body: JSON.stringify({ template, text }) });
      setText('');
      toast.success('Message sent anonymously.');
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2}>
      <TextField select label="Template" value={template} onChange={(e) => setTemplate(e.target.value)}>
        {templates.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
      </TextField>
      <TextField label="Custom message" multiline minRows={4} value={text} onChange={(e) => setText(e.target.value)} required />
      <Button type="submit" variant="contained">Send anonymously</Button>
    </Stack>
  );
}
