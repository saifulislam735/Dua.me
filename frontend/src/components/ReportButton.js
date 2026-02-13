import React from 'react';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import { apiWithAuth } from '../utils/api';

export default function ReportButton({ token, messageId, onDone }) {
  const report = async () => {
    try {
      await apiWithAuth(`/messages/report/${messageId}`, token, { method: 'POST', body: JSON.stringify({ reason: 'abusive' }) });
      toast.success('Reported to admin');
      onDone?.();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return <Button color="error" onClick={report}>Report</Button>;
}
