import React, { useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import SendMessage from './pages/SendMessage';
import Profile from './pages/Profile';
import InboxPage from './pages/InboxPage';
import Login from './components/Auth/Login';
import Dashboard from './components/Admin/Dashboard';

function SenderRoute() {
  const { username } = useParams();
  return <SendMessage username={username} />;
}

function PrivateRoute({ token, children }) {
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [mode, setMode] = useState('light');
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#2e7d8a' },
          secondary: { main: '#4caf50' }
        }
      }),
    [mode]
  );

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar>
            <Typography sx={{ flexGrow: 1 }}>Dua.me</Typography>
            <IconButton color="inherit" onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}>{mode === 'light' ? <Brightness4 /> : <Brightness7 />}</IconButton>
            {token ? <Button color="inherit" onClick={logout}>Logout</Button> : <Button color="inherit" href="/login">Login</Button>}
          </Toolbar>
        </AppBar>
        <Box sx={{ py: 3 }}>
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login onToken={setToken} />} />
              <Route path="/send/:username" element={<SenderRoute />} />
              <Route path="/@:username" element={<SenderRoute />} />
              <Route path="/profile" element={<PrivateRoute token={token}><Profile token={token} /></PrivateRoute>} />
              <Route path="/inbox" element={<PrivateRoute token={token}><InboxPage token={token} /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute token={token}><Dashboard token={token} /></PrivateRoute>} />
            </Routes>
          </Container>
        </Box>
      </BrowserRouter>
      <ToastContainer position="bottom-right" />
    </ThemeProvider>
  );
}
