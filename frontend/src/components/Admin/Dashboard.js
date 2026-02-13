import React, { useEffect, useState } from 'react';
import { List, ListItem, Typography } from '@mui/material';
import { api } from '../../utils/api';

export default function Dashboard({ token }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api('/admin/reports', { headers: { Authorization: `Bearer ${token}` } }).then(setReports);
  }, [token]);

  return (
    <>
      <Typography variant="h6">Open reports</Typography>
      <List>{reports.map((report) => <ListItem key={report.id}>{report.reason}</ListItem>)}</List>
    </>
  );
}
