import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { apiWithAuth } from '../../utils/api';

export default function Dashboard({ token }) {
  const [reports, setReports] = useState([]);

  const load = () => apiWithAuth('/admin/reports', token).then(setReports);
  useEffect(() => { load(); }, [token]);

  const deleteMessage = async (id) => {
    await apiWithAuth(`/admin/messages/${id}`, token, { method: 'DELETE' });
    load();
  };

  const deleteUser = async (id) => {
    await apiWithAuth(`/admin/users/${id}`, token, { method: 'DELETE' });
    load();
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Open reports</Typography>
      {reports.map((report) => (
        <Card key={report.id}><CardContent>
          <Typography>{report.text}</Typography>
          <Typography variant="caption">reason: {report.reason} • reporter: {report.reporter_id} • sender ip: {report.sender_ip || 'n/a'}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button color="error" onClick={() => deleteMessage(report.message_id)}>Delete message</Button>
            <Button color="error" onClick={() => deleteUser(report.receiver_id)}>Delete receiver</Button>
          </Stack>
        </CardContent></Card>
      ))}
    </Stack>
  );
}
