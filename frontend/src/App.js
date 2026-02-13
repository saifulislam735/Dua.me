import React from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import Home from './pages/Home';
import SendMessage from './pages/SendMessage';

function SenderRoute() {
  const { username } = useParams();
  return <SendMessage username={username} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:username" element={<SenderRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
