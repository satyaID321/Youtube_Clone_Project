import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import VideoPlayer from './pages/VideoPlayer';
import Channel from './pages/Channel';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/channel" element={<Channel />} />
          <Route path="/channel/:id" element={<Channel />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
