import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PclGestion from './components/PclGestion';
import DictamenIngreso from './components/DictamenIngreso';
import AdminUsuarios from './components/AdminUsuarios';
import ApelacionesTrazabilidad from './components/ApelacionesTrazabilidad';

// Estilos del tema Argon + tus estilos personalizados
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/argon-dashboard-react.css'; // ← Asegúrate de copiar este archivo desde el tema Argon
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (email, password) => {
    if (password === '123') {
      let role = 'Solicitante';
      if (email.includes('admin')) role = 'Administrador';
      else if (email.includes('medico')) role = 'Evaluador Médico';
      else if (email.includes('revisor')) role = 'Revisor de recursos';

      const userData = { email, role };
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('Simulando login a backend:', userData);
      alert('Login exitoso. Rol asignado: ' + role);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="main-content d-flex">
        {/* Sidebar de Argon */}
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Contenido principal */}
        <div className="content p-4 w-100">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/pcl/gestion" element={<PclGestion user={user} />} />
            {user.role === 'Evaluador Médico' && (
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
              element={
                <div className="alert alert-warning mt-4">
                  Página no encontrada o acceso denegado por rol.
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
