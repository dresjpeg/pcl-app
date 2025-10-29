import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Configuración de la URL del backend desde variable de entorno
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    aprobados: 0,
    rechazados: 0,
    recientes: []
  });
  const [dictamenes, setDictamenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener estadísticas de PCL
      const statsResponse = await axios.get(`${API_URL}/api/pcl/stats`);
      setStats(statsResponse.data);
      
      // Obtener dictámenes médicos recientes
      const dictamenesResponse = await axios.get(`${API_URL}/api/dictamen-medico`);
      setDictamenes(dictamenesResponse.data.slice(0, 5)); // Últimos 5
      
      setError(null);
    } catch (err) {
      console.error('Error al obtener datos:', err);
      setError('Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-warning text-dark';
      case 'aprobado':
        return 'bg-success';
      case 'rechazado':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchData}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Bienvenido, {user.nombre || user.email}</h2>
      <p className="text-muted">Rol: <strong>{user.role}</strong></p>

      {/* Estadísticas en Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total PCL</h5>
              <h2 className="card-text">{stats.total}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Pendientes</h5>
              <h2 className="card-text">{stats.pendientes}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Aprobados</h5>
              <h2 className="card-text">{stats.aprobados}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger">
            <div className="card-body">
              <h5 className="card-title">Rechazados</h5>
              <h2 className="card-text">{stats.rechazados}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Casos PCL Recientes */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Casos PCL Recientes</h4>
            </div>
            <div className="card-body">
              {stats.recientes.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Paciente</th>
                        <th>Solicitante</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recientes.map((pcl) => (
                        <tr key={pcl.id}>
                          <td>#{pcl.id}</td>
                          <td>{new Date(pcl.fecha).toLocaleDateString('es-ES')}</td>
                          <td>{pcl.paciente}</td>
                          <td>{pcl.solicitante_nombre || 'N/A'}</td>
                          <td>
                            <span className={`badge ${getEstadoBadgeClass(pcl.estado)}`}>
                              {pcl.estado.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No hay casos PCL recientes</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dictámenes Médicos Recientes */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h4 className="mb-0">Dictámenes Médicos Recientes</h4>
            </div>
            <div className="card-body">
              {dictamenes.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Diagnóstico</th>
                        <th>CIE-10</th>
                        <th>Algoritmo</th>
                        <th>Resultado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dictamenes.map((dictamen) => (
                        <tr key={dictamen.id}>
                          <td>#{dictamen.id}</td>
                          <td>{dictamen.diagnostico?.substring(0, 50) || 'N/A'}...</td>
                          <td><span className="badge bg-secondary">{dictamen.cie10}</span></td>
                          <td>{dictamen.algoritmo}</td>
                          <td>
                            <span className={`badge ${dictamen.resultado?.includes('Alto') ? 'bg-danger' : 'bg-success'}`}>
                              {dictamen.resultado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No hay dictámenes médicos recientes</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notificaciones y Accesos Rápidos */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Notificaciones</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {stats.pendientes > 0 && (
                  <li className="list-group-item">
                    <i className="bi bi-exclamation-circle text-warning"></i> 
                    {' '}Tienes {stats.pendientes} PCL pendientes de revisión
                  </li>
                )}
                {dictamenes.length > 0 && (
                  <li className="list-group-item">
                    <i className="bi bi-clipboard-check text-success"></i>
                    {' '}{dictamenes.length} dictámenes médicos registrados recientemente
                  </li>
                )}
                {stats.recientes.length > 0 && (
                  <li className="list-group-item">
                    <i className="bi bi-info-circle text-info"></i>
                    {' '}Último PCL ingresado: {stats.recientes[0].paciente}
                  </li>
                )}
                {stats.total === 0 && dictamenes.length === 0 && (
                  <li className="list-group-item text-muted">
                    No hay notificaciones nuevas
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Accesos Rápidos</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <a href="/pcl/gestion" className="btn btn-outline-primary">
                  <i className="bi bi-folder"></i> Gestión de PCL
                </a>
                {(user.role === 'Evaluador Médico' || user.role === 'Médico') && (
                  <a href="/dictamen/ingreso" className="btn btn-outline-success">
                    <i className="bi bi-clipboard-plus"></i> Ingresar Dictamen
                  </a>
                )}
                {user.role === 'Administrador' && (
                  <a href="/admin/usuarios" className="btn btn-outline-warning">
                    <i className="bi bi-people"></i> Administrar Usuarios
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;