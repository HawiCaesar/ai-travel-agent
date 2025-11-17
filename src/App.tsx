import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TravelProvider } from './context/TravelContext';
import LandingPage from './pages/LandingPage';
import TravelFormPage from './pages/TravelFormPage';
import ResultsPage from './pages/ResultsPage';

const App = () => {
  return (
    <TravelProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/plan" element={<TravelFormPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </Router>
    </TravelProvider>
  );
};

export default App;

