import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Radar from './pages/Radar';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Radar />} />
      </Routes>
    </BrowserRouter>
  );
}