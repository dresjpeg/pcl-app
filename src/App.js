import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PclGestion from './components/PclGestion';
import DictamenIngreso from './components/DictamenIngreso';
import AdminUsuarios from './components/AdminUsuarios';
import ApelacionesTrazabilidad from './components/ApelacionesTrazabilidad';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/argon-dashboard-react.css';
import './App.css';
import axios from 'axios';

// Configuración de la URL del backend desde variable de entorno
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Wrapper necesario para usar useNavigate fuera del Router
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/usuarios/login`, { email, password });
      if (response.data?.usuario) {
        const usuarioBD = response.data.usuario;
        const userData = {
          email: usuarioBD.email,
          nombre: usuarioBD.nombre,
          role: usuarioBD.rolNombre || 'Sin rol',
        };

        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(userData));
        alert('Login exitoso. Rol asignado: ' + userData.role);

        // Redirección automática por rol
        if (userData.role === 'Administrador') {
          navigate('/admin/usuarios');
        } else if (userData.role === 'Evaluador Médico' || userData.role === 'Médico') {
          navigate('/dictamen/ingreso');
        } else if (userData.role === 'Revisor de recursos') {
          navigate('/apelaciones/trazabilidad');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      console.error(error);
      alert('Error conectando al backend');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="main-content d-flex">
      {/* Sidebar Argon */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Contenido principal */}
      <div className="content p-4 w-100">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/pcl/gestion" element={<PclGestion user={user} />} />

          {(user.role === 'Evaluador Médico' || user.role === 'Médico') && (
            <Route path="/dictamen/ingreso" element={<DictamenIngreso user={user} />} />
          )}

          {user.role === 'Administrador' && (
            <Route path="/admin/usuarios" element={<AdminUsuarios user={user} />} />
          )}

          {user.role === 'Revisor de recursos' && (
            <Route path="/apelaciones/trazabilidad" element={<ApelacionesTrazabilidad user={user} />} />
          )}

          <Route
            path="*"
            element={<div className="alert alert-warning mt-4">Página no encontrada o acceso denegado por rol.</div>}
          />
        </Routes>
      </div>
    </div>
  );
}

export default AppWrapper;