import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './components/useAuth'
import Layout from './components/Layout';
import Login from './components/Login';
import Calculator from './components/Calculator.js';
import Records from './components/Records';
import 'bootstrap/dist/css/bootstrap.min.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/calculator" />} />
      
      <Route element={<Layout />}>
        <Route 
          path="/calculator" 
          element={
            <PrivateRoute>
              <Calculator />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/records" 
          element={
            <PrivateRoute>
              <Records />
            </PrivateRoute>
          } 
        />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;