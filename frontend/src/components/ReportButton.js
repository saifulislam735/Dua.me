import React from 'react';
import { Button } from '@mui/material';
import { api } from '../utils/api';

export default function ReportButton({ messageId, token }) {
  async function report() {
    await api(`/messages/report/${messageId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason: 'abusive' })
    });
  }

  return <Button color="error" onClick={report}>Report</Button>;
}
