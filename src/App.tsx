import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterFormData';
import ProtectedRoute from './components/ProtectedRoute';
import Maze from './pages/Maze';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Maze />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
