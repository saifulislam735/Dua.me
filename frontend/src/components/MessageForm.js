import React, { useState } from 'react';
import { Button, MenuItem, TextField } from '@mui/material';
import { api } from '../utils/api';

const templates = ['Send a dua for health', 'Guidance on career', 'Open-ended'];

export default function MessageForm({ username }) {
  const [template, setTemplate] = useState(templates[0]);
  const [text, setText] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    await api(`/messages/send/${username}`, {
      method: 'POST',
      body: JSON.stringify({ template, text })
    });
    setText('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField select label="Template" fullWidth margin="normal" value={template} onChange={(e) => setTemplate(e.target.value)}>
        {templates.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
      </TextField>
      <TextField label="Your anonymous dua/message" fullWidth multiline minRows={4} margin="normal" value={text} onChange={(e) => setText(e.target.value)} />
      <Button type="submit" variant="contained">Send anonymously</Button>
    </form>
  );
}
