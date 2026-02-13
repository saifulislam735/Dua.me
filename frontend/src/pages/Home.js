import React from 'react';
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';

const templateExamples = ['Dua for health', 'Guidance on career', 'Dua for success', 'General motivation'];

export default function Home() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3">Receive anonymous duas and guidance</Typography>
        <Typography sx={{ mt: 1 }}>
          Create your private inbox, share your link, and receive supportive anonymous messages in realtime.
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button variant="contained" href="/login">Create your link</Button>
          <Button variant="outlined" href="/@exampleuser">Send an example message</Button>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        {templateExamples.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">{item}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
